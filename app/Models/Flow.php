<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flow extends Model
{
    protected $fillable = [
        'room_id',
        'name',
        'icon',
        'description',
        'color',
        'position'
    ];

    const POSITION_GAP     = 1000;
    const INITIAL_POSITION = 10000;

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function flowActivities(): HasMany
    {
        return $this->hasMany(FlowActivity::class);
    }

    public static function getInitialPosition(int $roomId): int
    {
        $lastPosition = static::where('room_id', $roomId)->max('position');
        return ($lastPosition ?? self::INITIAL_POSITION) + self::POSITION_GAP;
    }

    public function moveUp(): void
    {
        $previous = static::where('room_id', $this->room_id)
            ->where('position', '<', $this->position)
            ->orderBy('position', 'desc')
            ->first();

        if ($previous) {
            // Move para uma posição anterior mantendo um gap
            $newPosition = $previous->position - (self::POSITION_GAP / 2);
            $this->position = (int)$newPosition;
            $this->save();
        }
    }

    public function moveDown(): void
    {
        $next = static::where('room_id', $this->room_id)
            ->where('position', '>', $this->position)
            ->orderBy('position')
            ->first();

        if ($next) {
            // Move para uma posição posterior mantendo um gap
            $newPosition = $next->position + (self::POSITION_GAP / 2);
            $this->position = (int)$newPosition;
            $this->save();
        }
    }

    public function rebalancePositions(): void
    {
        $flows = static::where('room_id', $this->room_id)
            ->orderBy('position')
            ->get();

        $position = self::INITIAL_POSITION;

        foreach ($flows as $flow) {
            $flow->position = $position;
            $flow->save();
            $position += self::POSITION_GAP;
        }
    }
}
