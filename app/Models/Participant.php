<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Participant extends Model
{
    protected $fillable = [
        'name',
        'room_id',
    ];

    protected $casts = [
        'created_at' => 'datetime'
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
