<?php

namespace Tests\Unit;

use App\Http\Requests\StoreExtensionRequest;
use App\Http\Requests\UpdateExtensionRequest;
use App\Http\Requests\UploadExtensionVersionRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExtensionFormRequestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_request_rules_and_authorization(): void
    {
        $request = new StoreExtensionRequest;

        $this->assertFalse($request->authorize());

        $user = User::factory()->create();
        $request->setUserResolver(fn () => $user);

        $this->assertTrue($request->authorize());
        $this->assertArrayHasKey('repository_url', $request->rules());
        $this->assertArrayHasKey('zip', $request->rules());
    }

    public function test_update_request_rules_and_authorization(): void
    {
        $request = new UpdateExtensionRequest;

        $this->assertFalse($request->authorize());

        $user = User::factory()->create();
        $request->setUserResolver(fn () => $user);

        $this->assertTrue($request->authorize());
        $this->assertArrayHasKey('repository_url', $request->rules());
    }

    public function test_upload_version_request_rules_and_authorization(): void
    {
        $request = new UploadExtensionVersionRequest;

        $this->assertFalse($request->authorize());

        $user = User::factory()->create();
        $request->setUserResolver(fn () => $user);

        $this->assertTrue($request->authorize());
        $this->assertArrayHasKey('zip', $request->rules());
    }
}
