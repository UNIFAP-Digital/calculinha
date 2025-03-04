<?php

namespace App\Models;

use App\Models\Abstracts\PositionablePivot;

class RoomModule extends PositionablePivot
{
    public $timestamps   = false;

    public function getPositionGroupColumn(): string
    {
        return 'room_id';
    }
}
