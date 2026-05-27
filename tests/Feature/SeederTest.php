<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Extension;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DemoExtensionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_seeder_creates_categories_and_is_idempotent(): void
    {
        $this->seed(CategorySeeder::class);
        $first = Category::count();
        $this->assertGreaterThan(0, $first);

        $this->seed(CategorySeeder::class);
        $this->assertSame($first, Category::count());
    }

    public function test_database_seeder_creates_admin_and_test_user(): void
    {
        Storage::fake('local');
        Storage::fake('public');

        $this->seed(DatabaseSeeder::class);

        $admin = User::where('email', 'admin@muxy.app')->first();
        $this->assertNotNull($admin);
        $this->assertTrue($admin->isAdmin());

        $this->assertTrue(User::where('email', 'test@example.com')->exists());
    }

    public function test_demo_seeder_skips_gracefully_when_source_missing(): void
    {
        // Point HOME at an empty dir so the demo source lookup misses,
        // then make sure the seeder does not throw and creates no demo extension.
        $tmpHome = sys_get_temp_dir().'/muxy-test-home-'.uniqid();
        @mkdir($tmpHome, 0755, true);
        $oldHome = $_SERVER['HOME'] ?? null;
        $_SERVER['HOME'] = $tmpHome;

        try {
            $this->seed(DemoExtensionSeeder::class);
            $this->assertFalse(Extension::where('slug', 'demo')->exists());
        } finally {
            if ($oldHome === null) {
                unset($_SERVER['HOME']);
            } else {
                $_SERVER['HOME'] = $oldHome;
            }
            @rmdir($tmpHome);
        }
    }
}
