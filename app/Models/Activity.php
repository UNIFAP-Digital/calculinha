<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    protected $fillable = [
        'content',
        'is_active'
    ];

    protected $casts = [
        'content'      => 'array',
        'is_active' => 'boolean'
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
