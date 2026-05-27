<?php

namespace App\Actions\Extensions;

use App\Models\Extension;
use App\Models\ExtensionVersion;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UploadExtensionVersion
{
    public function __construct(private readonly AnalyzeExtension $analyze) {}

    public function __invoke(Extension $extension, UploadedFile $zip): ExtensionVersion
    {
        $version = DB::transaction(function () use ($extension, $zip) {
            $version = new ExtensionVersion([
                'extension_id' => $extension->id,
                'status' => ExtensionVersion::STATUS_ANALYZING,
                'zip_path' => '',
            ]);
            $version->save();

            $name = 'upload-'.$version->id.'.zip';
            $relative = "extensions/{$extension->id}/versions/{$version->id}/{$name}";
            $zip->storeAs(
                "extensions/{$extension->id}/versions/{$version->id}",
                $name,
                ['disk' => 'local']
            );
            $version->zip_path = $relative;
            $version->save();

            $extension->status = Extension::STATUS_ANALYZING;
            $extension->save();

            return $version;
        });

        return ($this->analyze)($version);
    }
}
