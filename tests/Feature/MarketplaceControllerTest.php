<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Extension;
use App\Models\ExtensionVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MarketplaceControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
    }

    private function publishedExtension(array $attrs = []): Extension
    {
        $owner = User::factory()->create();
        $ext = Extension::create(array_merge([
            'user_id' => $owner->id,
            'slug' => 'ext-'.uniqid(),
            'name' => 'Sample',
            'summary' => 'Summary',
            'description' => 'Body',
            'repository_url' => 'https://github.com/me/ext',
            'status' => Extension::STATUS_APPROVED,
            'published_at' => now(),
        ], $attrs));

        $version = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'version' => '1.0.0',
            'zip_path' => "extensions/{$ext->id}/v1.zip",
            'status' => ExtensionVersion::STATUS_APPROVED,
        ]);
        $ext->current_version_id = $version->id;
        $ext->save();

        return $ext->fresh();
    }

    public function test_index_shows_only_published_extensions(): void
    {
        $published = $this->publishedExtension(['name' => 'Published one']);

        $draftOwner = User::factory()->create();
        Extension::create([
            'user_id' => $draftOwner->id,
            'slug' => 'draft-ext',
            'name' => 'Draft',
            'repository_url' => 'https://github.com/me/draft',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $this->get('/')->assertOk()->assertInertia(fn ($p) => $p
            ->component('marketplace/index')
            ->has('extensions', 1)
            ->where('extensions.0.slug', $published->slug),
        );
    }

    public function test_index_filters_by_search_term(): void
    {
        $alpha = $this->publishedExtension(['name' => 'Alpha tool', 'summary' => 'Cool']);
        $beta = $this->publishedExtension(['name' => 'Beta', 'summary' => 'Other']);

        $this->get('/?q=alpha')->assertInertia(fn ($p) => $p
            ->has('extensions', 1)
            ->where('extensions.0.slug', $alpha->slug),
        );
    }

    public function test_index_filters_by_category(): void
    {
        $a = $this->publishedExtension(['name' => 'A']);
        $b = $this->publishedExtension(['name' => 'B']);

        $cat = Category::create(['slug' => 'productivity', 'name' => 'Productivity']);
        $a->categories()->attach($cat);

        $this->get('/?category=productivity')->assertInertia(fn ($p) => $p
            ->where('category', 'productivity')
            ->has('extensions', 1)
            ->where('extensions.0.slug', $a->slug),
        );
    }

    public function test_show_returns_published_extension(): void
    {
        $ext = $this->publishedExtension(['slug' => 'shown']);

        $this->get('/extensions/shown')->assertOk()->assertInertia(fn ($p) => $p
            ->component('marketplace/show')
            ->where('extension.slug', 'shown'),
        );
    }

    public function test_show_404s_for_unpublished_extension(): void
    {
        $owner = User::factory()->create();
        Extension::create([
            'user_id' => $owner->id,
            'slug' => 'private-ext',
            'name' => 'Private',
            'repository_url' => 'https://github.com/me/private',
            'status' => Extension::STATUS_REVIEW,
        ]);

        $this->get('/extensions/private-ext')->assertNotFound();
    }

    public function test_download_streams_zip(): void
    {
        $ext = $this->publishedExtension();
        $version = $ext->currentVersion;
        Storage::disk('local')->put($version->zip_path, 'zip contents');

        $response = $this->get("/extensions/{$ext->slug}/download");

        $response->assertOk();
        $this->assertStringContainsString(
            "{$ext->slug}-",
            $response->headers->get('content-disposition'),
        );
    }

    public function test_download_404s_when_zip_missing(): void
    {
        $ext = $this->publishedExtension();

        $this->get("/extensions/{$ext->slug}/download")->assertNotFound();
    }

    public function test_download_404s_when_no_current_version(): void
    {
        // Edge case: extension is "approved" but somehow has no current_version_id;
        // published() scope filters this out, so route returns 404.
        $owner = User::factory()->create();
        Extension::create([
            'user_id' => $owner->id,
            'slug' => 'no-version',
            'name' => 'No version',
            'repository_url' => 'https://github.com/me/nv',
            'status' => Extension::STATUS_APPROVED,
            'published_at' => now(),
            'current_version_id' => null,
        ]);

        $this->get('/extensions/no-version/download')->assertNotFound();
    }
}
