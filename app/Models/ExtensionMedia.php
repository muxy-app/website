<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['extension_id', 'kind', 'path', 'mime', 'width', 'height', 'position'])]
class ExtensionMedia extends Model
{
    protected $table = 'extension_media';

    public const KIND_SCREENSHOT = 'screenshot';

    public const KIND_THUMBNAIL = 'thumbnail';

    public const KIND_ICON = 'icon';

    /** @return BelongsTo<Extension, $this> */
    public function extension(): BelongsTo
    {
        return $this->belongsTo(Extension::class);
    }

    public function url(): string
    {
        return Storage::disk('public')->url($this->path);
    }
}
