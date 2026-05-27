<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id', 'slug', 'name', 'summary', 'description',
    'repository_url', 'homepage_url', 'video_url',
    'status', 'current_version_id', 'published_at',
])]
class Extension extends Model
{
    public const STATUS_DRAFT = 'draft';

    public const STATUS_ANALYZING = 'analyzing';

    public const STATUS_REVIEW = 'review';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<ExtensionVersion, $this> */
    public function versions(): HasMany
    {
        return $this->hasMany(ExtensionVersion::class);
    }

    /** @return BelongsTo<ExtensionVersion, $this> */
    public function currentVersion(): BelongsTo
    {
        return $this->belongsTo(ExtensionVersion::class, 'current_version_id');
    }

    /** @return HasMany<ExtensionMedia, $this> */
    public function media(): HasMany
    {
        return $this->hasMany(ExtensionMedia::class)->orderBy('position');
    }

    /** @return BelongsToMany<Category, $this> */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED)->whereNotNull('current_version_id');
    }
}
