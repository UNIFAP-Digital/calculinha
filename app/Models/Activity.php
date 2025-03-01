<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    protected $fillable = [
        'content',
        'is_active'
    ];

    protected $casts = [
        'content'   => 'array',
        'is_active' => 'boolean'
    ];

    public function flowActivity(): HasMany
    {
        return $this->hasMany(FlowActivity::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
