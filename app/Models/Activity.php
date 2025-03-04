<?php

namespace App\Models;

use App\Enums\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    protected $fillable = [
        'content',
        'is_active',
        'operation',
    ];

    protected $casts = [
        'content'   => 'array',
        'is_active' => 'boolean',
        'operation' => Operation::class,
    ];

    public function moduleActivity(): HasMany
    {
        return $this->hasMany(ModuleActivity::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
