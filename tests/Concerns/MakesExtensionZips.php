<?php

namespace Tests\Concerns;

use Illuminate\Http\UploadedFile;
use ZipArchive;

trait MakesExtensionZips
{
    /**
     * Build a temporary zip from name => contents pairs and return it
     * as an UploadedFile suitable for ->post() multipart submissions.
     *
     * @param  array<string, string>  $files
     */
    protected function makeExtensionZip(array $files): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'extzip_').'.zip';
        $zip = new ZipArchive;
        $zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        foreach ($files as $name => $content) {
            $zip->addFromString($name, $content);
        }
        $zip->close();

        return new UploadedFile($path, basename($path), 'application/zip', null, true);
    }
}
