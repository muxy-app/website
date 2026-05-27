<?php

namespace Database\Seeders;

use App\Actions\Extensions\UploadExtensionVersion;
use App\Models\Category;
use App\Models\Extension;
use App\Models\ExtensionVersion;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ZipArchive;

class DemoExtensionSeeder extends Seeder
{
    public function run(): void
    {
        $sourceDir = ($_SERVER['HOME'] ?? '/Users/saeed').'/.config/muxy/extensions/demo';

        if (! is_dir($sourceDir) || ! is_file($sourceDir.'/manifest.json')) {
            $this->command?->warn("Demo source not found at {$sourceDir}; skipping demo extension seed.");

            return;
        }

        $owner = User::where('email', 'demo@muxy.app')->first()
            ?? User::factory()->create([
                'name' => 'Muxy Demo',
                'email' => 'demo@muxy.app',
                'email_verified_at' => now(),
            ]);

        if (Extension::where('slug', 'demo')->exists()) {
            $this->command?->info('Demo extension already exists; skipping.');

            return;
        }

        $tmpZip = tempnam(sys_get_temp_dir(), 'muxy_demo_').'.zip';
        $this->zipDirectory($sourceDir, $tmpZip);

        $uploaded = new UploadedFile($tmpZip, 'demo.zip', 'application/zip', null, true);

        $extension = Extension::create([
            'user_id' => $owner->id,
            'slug' => 'demo',
            'name' => 'Demo',
            'summary' => 'Reference extension demonstrating tabs, commands, topbar, status bar and settings.',
            'description' => "A working sample extension that ships in Muxy's docs. Use it as a starting point for new extensions.",
            'repository_url' => 'https://github.com/muxy-app/extension-demo',
            'status' => Extension::STATUS_DRAFT,
        ]);

        $devTools = Category::where('slug', 'developer-tools')->first();
        if ($devTools) {
            $extension->categories()->sync([$devTools->id]);
        }

        $version = app(UploadExtensionVersion::class)($extension, $uploaded);

        if ($version->status === ExtensionVersion::STATUS_MANUAL_REVIEW) {
            $version->fill([
                'status' => ExtensionVersion::STATUS_APPROVED,
                'reviewed_at' => now(),
                'review_notes' => 'Auto-approved by seeder.',
                'reviewed_by' => $owner->id,
            ])->save();

            $extension->fill([
                'status' => Extension::STATUS_APPROVED,
                'current_version_id' => $version->id,
                'published_at' => now(),
            ])->save();

            $this->command?->info('Seeded approved demo extension.');
        } else {
            $this->command?->warn('Demo extension analyze ended in status: '.$version->status);
        }

        @unlink($tmpZip);
    }

    private function zipDirectory(string $source, string $destination): void
    {
        File::ensureDirectoryExists(dirname($destination));

        $zip = new ZipArchive;
        if ($zip->open($destination, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException("Could not create zip at {$destination}");
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY,
        );

        $base = rtrim($source, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;

        foreach ($iterator as $file) {
            if ($file->isDir()) {
                continue;
            }
            $absolute = $file->getRealPath();
            $relative = substr($absolute, strlen($base));
            $relative = str_replace(DIRECTORY_SEPARATOR, '/', $relative);
            if (str_starts_with($relative, 'logs/')) {
                continue;
            }
            $zip->addFile($absolute, $relative);
        }

        $zip->close();
    }
}
