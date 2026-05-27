<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsureAdmin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class EnsureAdminMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_aborts_for_guest(): void
    {
        $middleware = new EnsureAdmin;

        try {
            $middleware->handle(Request::create('/admin/x'), fn () => new Response('ok'));
            $this->fail('Expected HttpException to be thrown.');
        } catch (HttpException $e) {
            $this->assertSame(403, $e->getStatusCode());
        }
    }

    public function test_aborts_for_non_admin_user(): void
    {
        $user = User::factory()->create();
        $request = Request::create('/admin/x');
        $request->setUserResolver(fn () => $user);

        $middleware = new EnsureAdmin;

        try {
            $middleware->handle($request, fn () => new Response('ok'));
            $this->fail('Expected HttpException to be thrown.');
        } catch (HttpException $e) {
            $this->assertSame(403, $e->getStatusCode());
        }
    }

    public function test_passes_for_admin(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $request = Request::create('/admin/x');
        $request->setUserResolver(fn () => $admin);

        $middleware = new EnsureAdmin;
        $response = $middleware->handle($request, fn () => new Response('ok'));

        $this->assertSame('ok', $response->getContent());
    }
}
