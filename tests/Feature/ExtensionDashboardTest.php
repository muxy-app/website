<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Extension;
use App\Models\ExtensionMedia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\MakesExtensionZips;
use Tests\TestCase;

class ExtensionDashboardTest extends TestCase
{
    use MakesExtensionZips;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
    }

    public function test_guests_are_redirected_from_my_extensions(): void
    {
        $this->get('/my/extensions')->assertRedirect('/login');
    }

    public function test_user_can_view_their_extensions_list(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Extension::create([
            'user_id' => $user->id,
            'slug' => 'mine',
            'name' => 'Mine',
            'repository_url' => 'https://github.com/me/mine',
            'status' => Extension::STATUS_DRAFT,
        ]);

        Extension::create([
            'user_id' => $other->id,
            'slug' => 'not-mine',
            'name' => 'Not Mine',
            'repository_url' => 'https://github.com/x/not-mine',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $response = $this->actingAs($user)->get('/my/extensions');
        $response->assertOk();
        $response->assertInertia(fn ($p) => $p
            ->component('extensions/index')
            ->has('extensions', 1)
            ->where('extensions.0.name', 'Mine'),
        );
    }

    public function test_create_page_renders_with_categories(): void
    {
        $user = User::factory()->create();
        Category::create(['slug' => 'productivity', 'name' => 'Productivity']);

        $this->actingAs($user)->get('/my/extensions/new')
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->component('extensions/create')
                ->has('categories', 1),
            );
    }

    public function test_store_attaches_categories_and_creates_slug(): void
    {
        $user = User::factory()->create();
        $cat = Category::create(['slug' => 'git', 'name' => 'Git']);

        $this->actingAs($user)->post('/my/extensions', [
            'name' => 'Hello World',
            'repository_url' => 'https://github.com/me/hw',
            'category_ids' => [$cat->id],
            'zip' => $this->makeExtensionZip([
                'manifest.json' => '{"name":"hw","version":"1.0.0"}',
            ]),
        ])->assertRedirect();

        $ext = Extension::first();
        $this->assertSame('hello-world', $ext->slug);
        $this->assertTrue($ext->categories->contains($cat->id));
    }

    public function test_store_increments_slug_when_taken(): void
    {
        $user = User::factory()->create();
        Extension::create([
            'user_id' => $user->id,
            'slug' => 'duplicate',
            'name' => 'Duplicate',
            'repository_url' => 'https://github.com/x/duplicate',
            'status' => Extension::STATUS_APPROVED,
        ]);

        $this->actingAs($user)->post('/my/extensions', [
            'name' => 'Duplicate',
            'repository_url' => 'https://github.com/me/dup2',
            'zip' => $this->makeExtensionZip([
                'manifest.json' => '{"name":"dup","version":"0.1.0"}',
            ]),
        ])->assertRedirect();

        $this->assertTrue(Extension::where('slug', 'duplicate-2')->exists());
    }

    public function test_store_falls_back_to_extension_slug_when_name_is_only_symbols(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/my/extensions', [
            'name' => '!!!',
            'repository_url' => 'https://github.com/me/symbols',
            'zip' => $this->makeExtensionZip([
                'manifest.json' => '{"name":"x","version":"0"}',
            ]),
        ])->assertRedirect();

        $this->assertTrue(Extension::where('slug', 'extension')->exists());
    }

    public function test_show_page_returns_my_extension_payload(): void
    {
        $user = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $user->id,
            'slug' => 'show-me',
            'name' => 'Show me',
            'repository_url' => 'https://github.com/me/show-me',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $this->actingAs($user)->get("/my/extensions/{$ext->id}")
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->component('extensions/show')
                ->where('extension.id', $ext->id),
            );
    }

    public function test_show_page_is_forbidden_for_other_users(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $owner->id,
            'slug' => 'private',
            'name' => 'Private',
            'repository_url' => 'https://github.com/me/private',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $this->actingAs($other)->get("/my/extensions/{$ext->id}")->assertForbidden();
    }

    public function test_update_saves_listing_details_and_syncs_categories(): void
    {
        $user = User::factory()->create();
        $catA = Category::create(['slug' => 'a', 'name' => 'A']);
        $catB = Category::create(['slug' => 'b', 'name' => 'B']);
        $ext = Extension::create([
            'user_id' => $user->id,
            'slug' => 'editable',
            'name' => 'Editable',
            'repository_url' => 'https://github.com/me/editable',
            'status' => Extension::STATUS_DRAFT,
        ]);
        $ext->categories()->sync([$catA->id]);

        $this->actingAs($user)->patch("/my/extensions/{$ext->id}", [
            'name' => 'Edited',
            'summary' => 'New summary',
            'description' => 'Long description here.',
            'repository_url' => 'https://github.com/me/edited',
            'video_url' => 'https://youtu.be/abc',
            'category_ids' => [$catB->id],
        ])->assertRedirect();

        $ext->refresh();
        $this->assertSame('Edited', $ext->name);
        $this->assertSame('New summary', $ext->summary);
        $this->assertSame('https://github.com/me/edited', $ext->repository_url);
        $this->assertEquals([$catB->id], $ext->categories->pluck('id')->all());
    }

    public function test_update_requires_authorization(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $owner->id,
            'slug' => 'forbidden-edit',
            'name' => 'X',
            'repository_url' => 'https://github.com/me/forbidden-edit',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $this->actingAs($other)
            ->patch("/my/extensions/{$ext->id}", [
                'name' => 'Hijack',
                'repository_url' => 'https://github.com/me/hijack',
            ])
            ->assertForbidden();
    }

    public function test_destroy_removes_extension_and_storage(): void
    {
        $user = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $user->id,
            'slug' => 'deletable',
            'name' => 'Deletable',
            'repository_url' => 'https://github.com/me/deletable',
            'status' => Extension::STATUS_DRAFT,
        ]);

        Storage::disk('local')->put("extensions/{$ext->id}/file.txt", 'x');
        Storage::disk('public')->put("extensions/{$ext->id}/file.txt", 'x');

        $this->actingAs($user)->delete("/my/extensions/{$ext->id}")->assertRedirect('/my/extensions');

        $this->assertNull(Extension::find($ext->id));
        Storage::disk('local')->assertMissing("extensions/{$ext->id}/file.txt");
        Storage::disk('public')->assertMissing("extensions/{$ext->id}/file.txt");
    }

    public function test_upload_new_version_creates_version(): void
    {
        $user = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $user->id,
            'slug' => 'has-versions',
            'name' => 'Versions',
            'repository_url' => 'https://github.com/me/has-versions',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $this->actingAs($user)->post("/my/extensions/{$ext->id}/versions", [
            'zip' => $this->makeExtensionZip([
                'manifest.json' => '{"name":"v","version":"2.0.0"}',
            ]),
        ])->assertRedirect();

        $ext->refresh();
        $this->assertSame(1, $ext->versions()->count());
        $this->assertSame('2.0.0', $ext->currentVersion->version);
    }

    public function test_upload_media_stores_image(): void
    {
        $user = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $user->id,
            'slug' => 'mediaful',
            'name' => 'Media',
            'repository_url' => 'https://github.com/me/mediaful',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $this->actingAs($user)->post("/my/extensions/{$ext->id}/media", [
            'image' => UploadedFile::fake()->image('shot.png', 1280, 720),
            'kind' => 'screenshot',
        ])->assertRedirect();

        $this->assertSame(1, $ext->media()->count());
    }

    public function test_destroy_media_removes_record_and_file(): void
    {
        $user = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $user->id,
            'slug' => 'mediafully',
            'name' => 'Mediafully',
            'repository_url' => 'https://github.com/me/mediafully',
            'status' => Extension::STATUS_DRAFT,
        ]);

        Storage::disk('public')->put("extensions/{$ext->id}/media/x.png", 'fake');
        $media = ExtensionMedia::create([
            'extension_id' => $ext->id,
            'kind' => ExtensionMedia::KIND_SCREENSHOT,
            'path' => "extensions/{$ext->id}/media/x.png",
            'mime' => 'image/png',
            'position' => 1,
        ]);

        $this->actingAs($user)->delete("/my/extensions/{$ext->id}/media/{$media->id}")
            ->assertRedirect();

        $this->assertNull(ExtensionMedia::find($media->id));
        Storage::disk('public')->assertMissing("extensions/{$ext->id}/media/x.png");
    }

    public function test_destroy_media_404s_when_media_belongs_to_another_extension(): void
    {
        $user = User::factory()->create();

        $extA = Extension::create([
            'user_id' => $user->id, 'slug' => 'ea', 'name' => 'EA',
            'repository_url' => 'https://github.com/me/ea', 'status' => Extension::STATUS_DRAFT,
        ]);
        $extB = Extension::create([
            'user_id' => $user->id, 'slug' => 'eb', 'name' => 'EB',
            'repository_url' => 'https://github.com/me/eb', 'status' => Extension::STATUS_DRAFT,
        ]);

        $media = ExtensionMedia::create([
            'extension_id' => $extB->id,
            'kind' => ExtensionMedia::KIND_SCREENSHOT,
            'path' => 'wrong/x.png',
            'mime' => 'image/png',
            'position' => 0,
        ]);

        $this->actingAs($user)
            ->delete("/my/extensions/{$extA->id}/media/{$media->id}")
            ->assertNotFound();
    }

    public function test_admin_bypasses_ownership_policy(): void
    {
        $owner = User::factory()->create();
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $ext = Extension::create([
            'user_id' => $owner->id,
            'slug' => 'admin-can',
            'name' => 'Admin Can',
            'repository_url' => 'https://github.com/me/admin-can',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $this->actingAs($admin)->get("/my/extensions/{$ext->id}")->assertOk();
    }
}
