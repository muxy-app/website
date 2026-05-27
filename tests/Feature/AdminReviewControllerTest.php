<?php

namespace Tests\Feature;

use App\Models\Extension;
use App\Models\ExtensionVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');

        $this->admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    private function seedExtension(string $status, ?string $versionStatus = null): Extension
    {
        $owner = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $owner->id,
            'slug' => $status.'-ext-'.uniqid(),
            'name' => 'Ext '.$status,
            'repository_url' => 'https://github.com/me/'.$status,
            'status' => $status,
        ]);

        if ($versionStatus) {
            $version = ExtensionVersion::create([
                'extension_id' => $ext->id,
                'version' => '1.0.0',
                'zip_path' => "extensions/{$ext->id}/v1.zip",
                'status' => $versionStatus,
            ]);
            $ext->current_version_id = $version->id;
            $ext->save();
        }

        return $ext;
    }

    public function test_queue_tab_lists_pending_only(): void
    {
        $review = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $approved = $this->seedExtension(Extension::STATUS_APPROVED, ExtensionVersion::STATUS_APPROVED);

        $response = $this->actingAs($this->admin)->get('/admin/extensions');

        $response->assertOk()->assertInertia(fn ($p) => $p
            ->component('admin/index')
            ->where('tab', 'queue')
            ->has('extensions', 1)
            ->where('extensions.0.id', $review->id),
        );
    }

    public function test_approved_tab_lists_only_approved(): void
    {
        $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $approved = $this->seedExtension(Extension::STATUS_APPROVED, ExtensionVersion::STATUS_APPROVED);

        $this->actingAs($this->admin)->get('/admin/extensions?tab=approved')
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->where('tab', 'approved')
                ->has('extensions', 1)
                ->where('extensions.0.id', $approved->id),
            );
    }

    public function test_rejected_tab_lists_only_rejected(): void
    {
        $rejected = $this->seedExtension(Extension::STATUS_REJECTED, ExtensionVersion::STATUS_REJECTED);

        $this->actingAs($this->admin)->get('/admin/extensions?tab=rejected')
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->has('extensions', 1)
                ->where('extensions.0.id', $rejected->id),
            );
    }

    public function test_all_tab_lists_everything(): void
    {
        $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $this->seedExtension(Extension::STATUS_APPROVED, ExtensionVersion::STATUS_APPROVED);

        $this->actingAs($this->admin)->get('/admin/extensions?tab=all')
            ->assertOk()
            ->assertInertia(fn ($p) => $p->has('extensions', 2));
    }

    public function test_show_returns_full_payload(): void
    {
        $ext = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);

        $this->actingAs($this->admin)->get("/admin/extensions/{$ext->id}")
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->component('admin/show')
                ->where('extension.id', $ext->id)
                ->has('extension.versions', 1),
            );
    }

    public function test_approve_marks_extension_published(): void
    {
        $ext = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $version = $ext->currentVersion;

        $this->actingAs($this->admin)
            ->post("/admin/extensions/{$ext->id}/versions/{$version->id}/approve", [
                'notes' => 'looks good',
            ])
            ->assertRedirect();

        $ext->refresh();
        $version->refresh();

        $this->assertSame(Extension::STATUS_APPROVED, $ext->status);
        $this->assertSame($version->id, $ext->current_version_id);
        $this->assertNotNull($ext->published_at);
        $this->assertSame(ExtensionVersion::STATUS_APPROVED, $version->status);
        $this->assertSame('looks good', $version->review_notes);
        $this->assertSame($this->admin->id, $version->reviewed_by);
        $this->assertNotNull($version->reviewed_at);
    }

    public function test_reject_requires_notes(): void
    {
        $ext = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $version = $ext->currentVersion;

        $this->actingAs($this->admin)
            ->post("/admin/extensions/{$ext->id}/versions/{$version->id}/reject", [])
            ->assertSessionHasErrors('notes');
    }

    public function test_reject_sets_status_and_notes(): void
    {
        $ext = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $version = $ext->currentVersion;

        $this->actingAs($this->admin)
            ->post("/admin/extensions/{$ext->id}/versions/{$version->id}/reject", [
                'notes' => 'missing tests',
            ])
            ->assertRedirect();

        $ext->refresh();
        $version->refresh();

        $this->assertSame(Extension::STATUS_REJECTED, $ext->status);
        $this->assertSame(ExtensionVersion::STATUS_REJECTED, $version->status);
        $this->assertSame('missing tests', $version->review_notes);
    }

    public function test_reject_of_non_current_version_keeps_approved_extension(): void
    {
        $owner = User::factory()->create();
        $ext = Extension::create([
            'user_id' => $owner->id,
            'slug' => 'kept-public',
            'name' => 'Kept Public',
            'repository_url' => 'https://github.com/me/kept-public',
            'status' => Extension::STATUS_APPROVED,
        ]);
        $v1 = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'version' => '1.0.0',
            'zip_path' => "extensions/{$ext->id}/v1.zip",
            'status' => ExtensionVersion::STATUS_APPROVED,
        ]);
        $v2 = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'version' => '2.0.0',
            'zip_path' => "extensions/{$ext->id}/v2.zip",
            'status' => ExtensionVersion::STATUS_MANUAL_REVIEW,
        ]);
        $ext->current_version_id = $v1->id;
        $ext->save();

        $this->actingAs($this->admin)
            ->post("/admin/extensions/{$ext->id}/versions/{$v2->id}/reject", [
                'notes' => 'new version not good',
            ])
            ->assertRedirect();

        $ext->refresh();
        $v2->refresh();

        $this->assertSame(Extension::STATUS_APPROVED, $ext->status);
        $this->assertSame($v1->id, $ext->current_version_id);
        $this->assertSame(ExtensionVersion::STATUS_REJECTED, $v2->status);
    }

    public function test_approve_404s_when_version_does_not_belong_to_extension(): void
    {
        $a = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $b = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);

        $this->actingAs($this->admin)
            ->post("/admin/extensions/{$a->id}/versions/{$b->currentVersion->id}/approve", [])
            ->assertNotFound();
    }

    public function test_download_zip_returns_file(): void
    {
        $ext = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $version = $ext->currentVersion;
        Storage::disk('local')->put($version->zip_path, 'fake zip contents');

        $response = $this->actingAs($this->admin)
            ->get("/admin/extensions/{$ext->id}/versions/{$version->id}/zip");

        $response->assertOk();
        $this->assertStringContainsString(
            "{$ext->slug}-",
            $response->headers->get('content-disposition'),
        );
    }

    public function test_download_zip_404s_when_file_missing(): void
    {
        $ext = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $version = $ext->currentVersion;

        $this->actingAs($this->admin)
            ->get("/admin/extensions/{$ext->id}/versions/{$version->id}/zip")
            ->assertNotFound();
    }

    public function test_download_zip_404s_when_version_belongs_to_other_extension(): void
    {
        $a = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);
        $b = $this->seedExtension(Extension::STATUS_REVIEW, ExtensionVersion::STATUS_MANUAL_REVIEW);

        $this->actingAs($this->admin)
            ->get("/admin/extensions/{$a->id}/versions/{$b->currentVersion->id}/zip")
            ->assertNotFound();
    }

    public function test_guests_cannot_access_admin_routes(): void
    {
        $this->get('/admin/extensions')->assertRedirect('/login');
    }
}
