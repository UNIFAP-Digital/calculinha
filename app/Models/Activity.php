<?php

namespace App\Models;

use App\Enums\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'content',
        'type',
        'operation',
        'owner_id'
    ];

    protected $casts = [
        'content'   => 'array',
        'operation' => Operation::class,
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
