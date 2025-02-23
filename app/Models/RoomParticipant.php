<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomParticipant extends Model
{
    protected $fillable = [
        'room_id',
        'name'
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
