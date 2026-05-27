<?php

namespace App\Actions\Extensions;

use App\Models\Extension;
use App\Models\ExtensionMedia;
use App\Models\ExtensionVersion;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;
use ZipArchive;

class AnalyzeExtension
{
    private const MAX_FILES = 5000;

    private const MAX_UNCOMPRESSED_BYTES = 200 * 1024 * 1024;

    private const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];

    public function __invoke(ExtensionVersion $version): ExtensionVersion
    {
        $errors = [];

        try {
            $zipAbsolute = Storage::disk('local')->path($version->zip_path);
            if (! is_file($zipAbsolute)) {
                throw new \RuntimeException('Uploaded zip file is missing from storage.');
            }

            $extractRelative = "extensions/{$version->extension_id}/versions/{$version->id}/extracted";
            $extractAbsolute = Storage::disk('local')->path($extractRelative);

            Storage::disk('local')->deleteDirectory($extractRelative);

            $zip = new ZipArchive;
            if ($zip->open($zipAbsolute) !== true) {
                throw new \RuntimeException('Could not open uploaded file as a zip archive.');
            }

            [$files, $totalSize, $extractRoot] = $this->extractSafely($zip, $extractAbsolute, $errors);
            $zip->close();

            $manifestPath = $extractRoot.'/manifest.json';
            $manifest = null;
            if (is_file($manifestPath)) {
                $raw = file_get_contents($manifestPath);
                try {
                    $manifest = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
                } catch (Throwable $e) {
                    $errors[] = 'manifest.json is not valid JSON: '.$e->getMessage();
                }
            } else {
                $errors[] = 'manifest.json was not found at the archive root.';
            }

            $sha256 = hash_file('sha256', $zipAbsolute);
            $sizeBytes = filesize($zipAbsolute) ?: null;

            $extractedRelative = Str::after($extractRoot, Storage::disk('local')->path('').DIRECTORY_SEPARATOR);
            $extractedRelative = str_replace(DIRECTORY_SEPARATOR, '/', $extractedRelative);

            $version->fill([
                'manifest' => $manifest,
                'file_list' => array_values(array_slice($files, 0, self::MAX_FILES)),
                'sha256' => $sha256,
                'size_bytes' => $sizeBytes,
                'extracted_path' => $extractedRelative,
                'analysis_errors' => $errors ?: null,
                'version' => is_array($manifest) ? ($manifest['version'] ?? null) : null,
                'status' => $errors ? ExtensionVersion::STATUS_FAILED : ExtensionVersion::STATUS_MANUAL_REVIEW,
            ])->save();

            if (! $errors) {
                $this->bumpExtensionToReview($version);
                $this->seedManifestMetadata($version, $manifest, $extractRoot);
            }
        } catch (Throwable $e) {
            Log::warning('Extension analyze failed', [
                'version_id' => $version->id,
                'error' => $e->getMessage(),
            ]);
            $version->fill([
                'analysis_errors' => [$e->getMessage()],
                'status' => ExtensionVersion::STATUS_FAILED,
            ])->save();
        }

        return $version->fresh() ?? $version;
    }

    /**
     * @param  array<int, string>  $errors
     * @return array{0: array<int, array{path: string, size: int}>, 1: int, 2: string}
     */
    private function extractSafely(ZipArchive $zip, string $extractAbsolute, array &$errors): array
    {
        @mkdir($extractAbsolute, 0755, true);

        $files = [];
        $totalSize = 0;
        $count = $zip->numFiles;

        for ($i = 0; $i < $count; $i++) {
            $stat = $zip->statIndex($i);
            if (! $stat) {
                continue;
            }
            $name = $stat['name'];

            if ($this->isPathUnsafe($name)) {
                $errors[] = "Refused unsafe path in archive: {$name}";

                continue;
            }
            if (str_ends_with($name, '/')) {
                @mkdir($extractAbsolute.'/'.$name, 0755, true);

                continue;
            }
            $totalSize += (int) $stat['size'];
            if ($totalSize > self::MAX_UNCOMPRESSED_BYTES) {
                $errors[] = 'Archive exceeds the 200MB uncompressed size limit.';
                break;
            }
            if (count($files) >= self::MAX_FILES) {
                $errors[] = 'Archive exceeds the 5000 file limit.';
                break;
            }

            $target = $extractAbsolute.'/'.$name;
            @mkdir(dirname($target), 0755, true);
            $stream = $zip->getStream($name);
            if (! $stream) {
                $errors[] = "Could not read entry: {$name}";

                continue;
            }
            $out = fopen($target, 'wb');
            if (! $out) {
                fclose($stream);
                $errors[] = "Could not write entry: {$name}";

                continue;
            }
            stream_copy_to_stream($stream, $out);
            fclose($stream);
            fclose($out);

            $files[] = ['path' => $name, 'size' => (int) $stat['size']];
        }

        $root = $this->detectRoot($extractAbsolute);

        return [$files, $totalSize, $root];
    }

    private function isPathUnsafe(string $path): bool
    {
        if ($path === '' || str_starts_with($path, '/')) {
            return true;
        }
        if (str_contains($path, '\\')) {
            return true;
        }
        foreach (explode('/', $path) as $part) {
            if ($part === '..' || $part === '.') {
                return true;
            }
        }

        return false;
    }

    private function detectRoot(string $dir): string
    {
        $entries = array_values(array_diff(scandir($dir) ?: [], ['.', '..']));
        if (count($entries) === 1) {
            $only = $dir.'/'.$entries[0];
            if (is_dir($only) && ! is_file($dir.'/manifest.json') && is_file($only.'/manifest.json')) {
                return $only;
            }
        }

        return $dir;
    }

    /**
     * @param  array<string, mixed>|null  $manifest
     */
    private function seedManifestMetadata(ExtensionVersion $version, ?array $manifest, string $extractRoot): void
    {
        if (! $manifest) {
            return;
        }
        $extension = $version->extension;
        if (! $extension) {
            return;
        }

        $changed = false;

        if (empty($extension->summary) && ! empty($manifest['description'])) {
            $extension->summary = Str::limit((string) $manifest['description'], 240, '');
            $changed = true;
        }
        if (empty($extension->description) && ! empty($manifest['description'])) {
            $extension->description = (string) $manifest['description'];
            $changed = true;
        }

        if ($changed) {
            $extension->save();
        }

        $this->harvestIcons($extension, $manifest, $extractRoot);
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    private function harvestIcons(Extension $extension, array $manifest, string $extractRoot): void
    {
        $iconPaths = [];

        $topbar = $manifest['topbarItems'] ?? [];
        if (is_array($topbar)) {
            foreach ($topbar as $item) {
                if (is_array($item) && isset($item['icon']['svg']) && is_string($item['icon']['svg'])) {
                    $iconPaths[] = $item['icon']['svg'];
                }
            }
        }
        if (isset($manifest['icon']) && is_string($manifest['icon'])) {
            $iconPaths[] = $manifest['icon'];
        }

        $position = 0;
        foreach (array_unique($iconPaths) as $relative) {
            if ($this->isPathUnsafe($relative)) {
                continue;
            }
            $source = $extractRoot.'/'.$relative;
            if (! is_file($source)) {
                continue;
            }
            $ext = strtolower(pathinfo($relative, PATHINFO_EXTENSION));
            if (! in_array($ext, self::IMAGE_EXTS, true)) {
                continue;
            }

            $name = Str::random(12).'.'.$ext;
            $publicPath = "extensions/{$extension->id}/icons/{$name}";
            Storage::disk('public')->put($publicPath, file_get_contents($source));

            ExtensionMedia::create([
                'extension_id' => $extension->id,
                'kind' => ExtensionMedia::KIND_ICON,
                'path' => $publicPath,
                'mime' => match ($ext) {
                    'svg' => 'image/svg+xml',
                    'jpg', 'jpeg' => 'image/jpeg',
                    default => 'image/'.$ext,
                },
                'position' => $position++,
            ]);
        }
    }

    private function bumpExtensionToReview(ExtensionVersion $version): void
    {
        $extension = $version->extension;
        if (! $extension) {
            return;
        }
        if ($extension->status === Extension::STATUS_APPROVED) {
            return;
        }
        $extension->status = Extension::STATUS_REVIEW;
        $extension->save();
    }
}
