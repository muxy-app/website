<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Extension;
use App\Models\ExtensionMedia;
use App\Models\ExtensionVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelHelpersTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_is_admin_helper(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $user = User::factory()->create();

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($user->isAdmin());
    }

    public function test_extension_relationships_load(): void
    {
        $owner = User::factory()->create();
        $cat = Category::create(['slug' => 'p', 'name' => 'P']);
        $ext = Extension::create([
            'user_id' => $owner->id,
            'slug' => 'rel',
            'name' => 'Rel',
            'repository_url' => 'https://github.com/me/rel',
            'status' => Extension::STATUS_DRAFT,
        ]);
        $ext->categories()->attach($cat);
        $version = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'zip_path' => 'extensions/'.$ext->id.'/v.zip',
            'status' => ExtensionVersion::STATUS_APPROVED,
        ]);
        $ext->current_version_id = $version->id;
        $ext->save();

        $this->assertSame($owner->id, $ext->user->id);
        $this->assertSame(1, $ext->versions->count());
        $this->assertSame($version->id, $ext->currentVersion->id);
        $this->assertSame(1, $ext->categories->count());
        $this->assertSame($ext->id, $version->extension->id);
    }

    public function test_extension_published_scope(): void
    {
        $owner = User::factory()->create();

        $draft = Extension::create([
            'user_id' => $owner->id, 'slug' => 'd', 'name' => 'D',
            'repository_url' => 'https://github.com/me/d', 'status' => Extension::STATUS_DRAFT,
        ]);

        $approvedNoVersion = Extension::create([
            'user_id' => $owner->id, 'slug' => 'a', 'name' => 'A',
            'repository_url' => 'https://github.com/me/a', 'status' => Extension::STATUS_APPROVED,
        ]);

        $approvedWithVersion = Extension::create([
            'user_id' => $owner->id, 'slug' => 'aw', 'name' => 'AW',
            'repository_url' => 'https://github.com/me/aw', 'status' => Extension::STATUS_APPROVED,
        ]);
        $v = ExtensionVersion::create([
            'extension_id' => $approvedWithVersion->id,
            'zip_path' => 'p.zip',
            'status' => ExtensionVersion::STATUS_APPROVED,
        ]);
        $approvedWithVersion->current_version_id = $v->id;
        $approvedWithVersion->save();

        $published = Extension::published()->get();
        $this->assertCount(1, $published);
        $this->assertSame($approvedWithVersion->id, $published->first()->id);
    }

    public function test_version_public_status_mapping(): void
    {
        $version = new ExtensionVersion;

        $version->status = ExtensionVersion::STATUS_ANALYZING;
        $this->assertSame('analyzing', $version->publicStatus());

        $version->status = ExtensionVersion::STATUS_MANUAL_REVIEW;
        $this->assertSame('review', $version->publicStatus());

        $version->status = ExtensionVersion::STATUS_APPROVED;
        $this->assertSame('approved', $version->publicStatus());

        $version->status = ExtensionVersion::STATUS_REJECTED;
        $this->assertSame('rejected', $version->publicStatus());

        $version->status = ExtensionVersion::STATUS_FAILED;
        $this->assertSame('failed', $version->publicStatus());

        $version->status = 'mystery';
        $this->assertSame('mystery', $version->publicStatus());
    }

    public function test_version_reviewer_relationship(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $owner = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $owner->id, 'slug' => 'rv', 'name' => 'Rv',
            'repository_url' => 'https://github.com/me/rv', 'status' => Extension::STATUS_REVIEW,
        ]);
        $version = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'zip_path' => 'x.zip',
            'status' => ExtensionVersion::STATUS_APPROVED,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);

        $this->assertSame($admin->id, $version->reviewer->id);
    }

    public function test_media_url_uses_public_disk(): void
    {
        $owner = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $owner->id, 'slug' => 'm', 'name' => 'M',
            'repository_url' => 'https://github.com/me/m', 'status' => Extension::STATUS_DRAFT,
        ]);

        $media = ExtensionMedia::create([
            'extension_id' => $ext->id,
            'kind' => ExtensionMedia::KIND_SCREENSHOT,
            'path' => 'extensions/'.$ext->id.'/m/shot.png',
            'mime' => 'image/png',
            'position' => 0,
        ]);

        $url = $media->url();
        $this->assertIsString($url);
        $this->assertStringContainsString('extensions/'.$ext->id.'/m/shot.png', $url);

        // Inverse relationship: media -> extension.
        $this->assertSame($ext->id, $media->extension->id);
    }

    public function test_category_extensions_relationship(): void
    {
        $owner = User::factory()->create();
        $cat = Category::create(['slug' => 'cer', 'name' => 'Cer']);
        $ext = Extension::create([
            'user_id' => $owner->id, 'slug' => 'cer-e', 'name' => 'Cer E',
            'repository_url' => 'https://github.com/me/cer-e', 'status' => Extension::STATUS_DRAFT,
        ]);
        $ext->categories()->attach($cat);

        $this->assertSame(1, $cat->extensions()->count());
        $this->assertSame($ext->id, $cat->extensions->first()->id);
    }
}
