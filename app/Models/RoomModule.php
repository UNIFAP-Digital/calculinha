<?php

namespace App\Models;

use App\Models\Abstracts\PositionablePivot;

class RoomModule extends PositionablePivot
{
    public $incrementing = true;
    public $timestamps   = false;

    public function getPositionGroupColumn(): string
    {
        return 'room_id';
    }
}
