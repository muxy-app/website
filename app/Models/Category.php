<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['slug', 'name', 'description'])]
class Category extends Model
{
    /** @return BelongsToMany<Extension, $this> */
    public function extensions(): BelongsToMany
    {
        return $this->belongsToMany(Extension::class);
    }
}
