<?php

namespace App\Models;

use App\Models\Abstracts\PositionableModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomFlow extends PositionableModel
{
    public $timestamps = false;

    protected $fillable = [
        'room_id',
        'flow_id',
        'position',
    ];

    public function flow(): BelongsTo
    {
        return $this->belongsTo(Flow::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function getPositionGroupColumn(): string
    {
        return 'room_id';
    }
}
