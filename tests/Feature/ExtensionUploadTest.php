<?php

namespace Tests\Feature;

use App\Models\Extension;
use App\Models\ExtensionVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\MakesExtensionZips;
use Tests\TestCase;

class ExtensionUploadTest extends TestCase
{
    use MakesExtensionZips;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
    }

    public function test_verified_user_can_upload_an_extension_and_it_lands_in_review(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post('/my/extensions', [
            'name' => 'My Cool Ext',
            'summary' => 'Does cool things.',
            'repository_url' => 'https://github.com/me/cool-ext',
            'zip' => $this->makeExtensionZip([
                'manifest.json' => json_encode([
                    'name' => 'cool',
                    'version' => '1.0.0',
                    'description' => 'A cool extension.',
                    'entrypoint' => 'run.sh',
                ]),
                'run.sh' => "#!/bin/bash\necho hi\n",
            ]),
        ]);

        $extension = Extension::first();
        $this->assertNotNull($extension);
        $response->assertRedirect("/my/extensions/{$extension->id}");

        $this->assertSame('My Cool Ext', $extension->name);
        $this->assertSame('https://github.com/me/cool-ext', $extension->repository_url);
        $this->assertSame(Extension::STATUS_REVIEW, $extension->status);
        $this->assertNotNull($extension->current_version_id);

        $version = $extension->currentVersion;
        $this->assertSame(ExtensionVersion::STATUS_MANUAL_REVIEW, $version->status);
        $this->assertSame('1.0.0', $version->version);
        $this->assertNotEmpty($version->sha256);
        $this->assertIsArray($version->manifest);
        $this->assertSame('cool', $version->manifest['name']);
    }

    public function test_upload_requires_repository_url(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post('/my/extensions', [
            'name' => 'No Repo',
            'zip' => $this->makeExtensionZip([
                'manifest.json' => '{"name":"x","version":"0.1.0"}',
            ]),
        ]);

        $response->assertSessionHasErrors('repository_url');
        $this->assertSame(0, Extension::count());
    }

    public function test_zip_without_manifest_records_failed_status(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post('/my/extensions', [
            'name' => 'Broken',
            'repository_url' => 'https://github.com/me/broken',
            'zip' => $this->makeExtensionZip([
                'readme.txt' => 'no manifest here',
            ]),
        ])->assertRedirect();

        $version = ExtensionVersion::first();
        $this->assertNotNull($version);
        $this->assertSame(ExtensionVersion::STATUS_FAILED, $version->status);
        $this->assertNotEmpty($version->analysis_errors);
    }

    public function test_admin_can_approve_a_version_and_extension_becomes_public(): void
    {
        $owner = User::factory()->create();
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($owner)->post('/my/extensions', [
            'name' => 'Pendings',
            'repository_url' => 'https://github.com/me/pending',
            'zip' => $this->makeExtensionZip([
                'manifest.json' => '{"name":"p","version":"1.2.3"}',
            ]),
        ])->assertRedirect();

        $extension = Extension::first();
        $version = $extension->currentVersion;

        $this->actingAs($admin)
            ->post("/admin/extensions/{$extension->id}/versions/{$version->id}/approve", [
                'notes' => 'lgtm',
            ])
            ->assertRedirect();

        $extension->refresh();
        $version->refresh();

        $this->assertSame(Extension::STATUS_APPROVED, $extension->status);
        $this->assertSame(ExtensionVersion::STATUS_APPROVED, $version->status);
        $this->assertSame($admin->id, $version->reviewed_by);

        $this->get("/extensions/{$extension->slug}")->assertOk();
        $this->get('/')->assertOk();
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->get('/admin/extensions')->assertForbidden();
    }
}
