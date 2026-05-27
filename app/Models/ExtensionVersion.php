<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'extension_id', 'version', 'zip_path', 'extracted_path',
    'sha256', 'size_bytes', 'manifest', 'file_list',
    'analysis_errors', 'status', 'review_notes',
    'reviewed_by', 'reviewed_at',
])]
class ExtensionVersion extends Model
{
    public const STATUS_ANALYZING = 'analyzing';

    public const STATUS_MANUAL_REVIEW = 'manual_review';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_FAILED = 'failed';

    protected function casts(): array
    {
        return [
            'manifest' => 'array',
            'file_list' => 'array',
            'analysis_errors' => 'array',
            'reviewed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Extension, $this> */
    public function extension(): BelongsTo
    {
        return $this->belongsTo(Extension::class);
    }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function publicStatus(): string
    {
        return match ($this->status) {
            self::STATUS_ANALYZING => 'analyzing',
            self::STATUS_MANUAL_REVIEW => 'review',
            self::STATUS_APPROVED => 'approved',
            self::STATUS_REJECTED => 'rejected',
            self::STATUS_FAILED => 'failed',
            default => $this->status,
        };
    }
}
