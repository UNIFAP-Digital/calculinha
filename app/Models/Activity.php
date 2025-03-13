<?php

namespace App\Models;

use App\Enums\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    protected $fillable = [
        'content',
        'type',
        'is_active',
        'operation',
    ];

    protected $casts = [
        'content'   => 'array',
        'is_active' => 'boolean',
        'operation' => Operation::class,
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
