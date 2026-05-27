<?php

namespace Tests\Unit;

use App\Models\Extension;
use App\Models\User;
use App\Policies\ExtensionPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExtensionPolicyTest extends TestCase
{
    use RefreshDatabase;

    private function extensionFor(User $user): Extension
    {
        return Extension::create([
            'user_id' => $user->id,
            'slug' => 'pol-'.uniqid(),
            'name' => 'Pol',
            'repository_url' => 'https://github.com/me/pol',
            'status' => Extension::STATUS_DRAFT,
        ]);
    }

    public function test_owner_can_view_update_delete(): void
    {
        $owner = User::factory()->create();
        $ext = $this->extensionFor($owner);

        $policy = new ExtensionPolicy;

        $this->assertTrue($policy->view($owner, $ext));
        $this->assertTrue($policy->update($owner, $ext));
        $this->assertTrue($policy->delete($owner, $ext));
    }

    public function test_other_user_cannot_view_update_delete(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $ext = $this->extensionFor($owner);

        $policy = new ExtensionPolicy;

        $this->assertFalse($policy->view($other, $ext));
        $this->assertFalse($policy->update($other, $ext));
        $this->assertFalse($policy->delete($other, $ext));
    }

    public function test_admin_bypasses_via_before_hook(): void
    {
        $owner = User::factory()->create();
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $ext = $this->extensionFor($owner);

        $policy = new ExtensionPolicy;

        $this->assertTrue($policy->before($admin));
        $this->assertNull($policy->before($owner));
    }
}
