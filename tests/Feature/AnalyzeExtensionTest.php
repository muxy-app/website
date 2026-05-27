<?php

namespace Tests\Feature;

use App\Actions\Extensions\AnalyzeExtension;
use App\Models\Extension;
use App\Models\ExtensionMedia;
use App\Models\ExtensionVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use ZipArchive;

class AnalyzeExtensionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
    }

    private function makeExtension(): Extension
    {
        $user = User::factory()->create();

        return Extension::create([
            'user_id' => $user->id,
            'slug' => 'analyze-'.uniqid(),
            'name' => 'A',
            'repository_url' => 'https://github.com/me/a',
            'status' => Extension::STATUS_DRAFT,
        ]);
    }

    /**
     * Write a zip directly to the fake local disk and return the ExtensionVersion
     * pointing at it.
     *
     * @param  array<string, string>  $files
     */
    private function seedVersionWithZip(Extension $extension, array $files): ExtensionVersion
    {
        $version = ExtensionVersion::create([
            'extension_id' => $extension->id,
            'zip_path' => "extensions/{$extension->id}/versions/seed/seed.zip",
            'status' => ExtensionVersion::STATUS_ANALYZING,
        ]);

        $version->zip_path = "extensions/{$extension->id}/versions/{$version->id}/upload.zip";
        $version->save();

        $abs = Storage::disk('local')->path($version->zip_path);
        @mkdir(dirname($abs), 0755, true);

        $zip = new ZipArchive;
        $zip->open($abs, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        foreach ($files as $name => $content) {
            $zip->addFromString($name, $content);
        }
        $zip->close();

        return $version;
    }

    public function test_analyzes_archive_with_nested_root_folder(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'mypkg/manifest.json' => '{"name":"x","version":"1.2.3"}',
            'mypkg/run.sh' => "echo x\n",
        ]);

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_MANUAL_REVIEW, $version->status);
        $this->assertSame('1.2.3', $version->version);
        $this->assertSame('x', $version->manifest['name']);
    }

    public function test_rejects_path_traversal_entries(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => '{"name":"ok","version":"0.1.0"}',
            '../escape.txt' => 'malicious',
        ]);

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_FAILED, $version->status);
        $this->assertNotEmpty($version->analysis_errors);
        $this->assertStringContainsString(
            'unsafe path',
            implode("\n", $version->analysis_errors),
        );
    }

    public function test_invalid_json_manifest_marks_failed(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => '{not json',
            'run.sh' => "echo x\n",
        ]);

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_FAILED, $version->status);
        $this->assertNotEmpty($version->analysis_errors);
    }

    public function test_missing_zip_file_marks_failed(): void
    {
        $ext = $this->makeExtension();
        $version = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'zip_path' => 'extensions/missing.zip',
            'status' => ExtensionVersion::STATUS_ANALYZING,
        ]);

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_FAILED, $version->status);
        $this->assertNotEmpty($version->analysis_errors);
    }

    public function test_unopenable_archive_marks_failed(): void
    {
        $ext = $this->makeExtension();
        $version = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'zip_path' => "extensions/{$ext->id}/broken.zip",
            'status' => ExtensionVersion::STATUS_ANALYZING,
        ]);
        Storage::disk('local')->put($version->zip_path, 'this is not a zip file');

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_FAILED, $version->status);
        $this->assertNotEmpty($version->analysis_errors);
    }

    public function test_harvests_topbar_svg_icon_as_media(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => json_encode([
                'name' => 'iconic',
                'version' => '1.0.0',
                'description' => 'has icons',
                'topbarItems' => [
                    ['id' => 'top', 'icon' => ['svg' => 'assets/top.svg']],
                ],
            ]),
            'assets/top.svg' => '<svg xmlns="http://www.w3.org/2000/svg"/>',
        ]);

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_MANUAL_REVIEW, $version->status);
        $this->assertSame(1, $ext->media()->where('kind', ExtensionMedia::KIND_ICON)->count());
    }

    public function test_harvests_top_level_icon_field(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => json_encode([
                'name' => 'iconic',
                'version' => '1.0.0',
                'icon' => 'icon.png',
            ]),
            'icon.png' => str_repeat('A', 64),
        ]);

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(1, $ext->media()->where('kind', ExtensionMedia::KIND_ICON)->count());
    }

    public function test_skips_icons_with_non_image_extensions(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => json_encode([
                'name' => 'bad-icon',
                'version' => '1.0.0',
                'icon' => 'notes.txt',
            ]),
            'notes.txt' => 'not an image',
        ]);

        (new AnalyzeExtension)($version);

        $this->assertSame(0, $ext->media()->count());
    }

    public function test_seeds_summary_and_description_from_manifest(): void
    {
        $ext = $this->makeExtension();
        $ext->summary = null;
        $ext->description = null;
        $ext->save();

        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => json_encode([
                'name' => 'auto-described',
                'version' => '1.0.0',
                'description' => 'A long manifest description that should populate the listing fields automatically.',
            ]),
        ]);

        (new AnalyzeExtension)($version);
        $ext->refresh();

        $this->assertNotNull($ext->summary);
        $this->assertNotNull($ext->description);
        $this->assertStringContainsString('long manifest description', $ext->description);
    }

    public function test_does_not_overwrite_existing_summary_or_description(): void
    {
        $ext = $this->makeExtension();
        $ext->summary = 'My summary';
        $ext->description = 'My description';
        $ext->save();

        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => json_encode([
                'name' => 'x',
                'version' => '1.0.0',
                'description' => 'Manifest description',
            ]),
        ]);

        (new AnalyzeExtension)($version);
        $ext->refresh();

        $this->assertSame('My summary', $ext->summary);
        $this->assertSame('My description', $ext->description);
    }

    public function test_analyze_does_not_downgrade_already_approved_extension(): void
    {
        $ext = $this->makeExtension();
        $ext->status = Extension::STATUS_APPROVED;
        $ext->save();

        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => '{"name":"x","version":"2.0.0"}',
        ]);

        (new AnalyzeExtension)($version);
        $ext->refresh();

        $this->assertSame(Extension::STATUS_APPROVED, $ext->status);
    }

    public function test_directory_entries_are_created(): void
    {
        $ext = $this->makeExtension();

        $version = ExtensionVersion::create([
            'extension_id' => $ext->id,
            'zip_path' => "extensions/{$ext->id}/dir.zip",
            'status' => ExtensionVersion::STATUS_ANALYZING,
        ]);
        $abs = Storage::disk('local')->path($version->zip_path);
        @mkdir(dirname($abs), 0755, true);
        $zip = new ZipArchive;
        $zip->open($abs, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        $zip->addEmptyDir('subdir');
        $zip->addFromString('manifest.json', '{"name":"x","version":"1.0.0"}');
        $zip->addFromString('subdir/run.sh', "echo x\n");
        $zip->close();

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_MANUAL_REVIEW, $version->status);
    }

    public function test_absolute_path_is_rejected(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => '{"name":"x","version":"0.1.0"}',
            '/etc/hosts' => 'malicious',
        ]);

        (new AnalyzeExtension)($version);
        $version->refresh();

        $this->assertSame(ExtensionVersion::STATUS_FAILED, $version->status);
    }

    public function test_skips_unsafe_icon_paths_silently(): void
    {
        $ext = $this->makeExtension();
        $version = $this->seedVersionWithZip($ext, [
            'manifest.json' => json_encode([
                'name' => 'x',
                'version' => '1.0.0',
                'icon' => '../etc/passwd',
            ]),
        ]);

        (new AnalyzeExtension)($version);

        $this->assertSame(0, $ext->media()->count());
    }
}
