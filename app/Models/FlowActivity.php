<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlowActivity extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'flow_id',
        'activity_id',
        'position',
    ];

    protected $casts = [
        'position' => 'integer'
    ];

    const POSITION_GAP     = 1000;
    const INITIAL_POSITION = 10000;

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function flow(): BelongsTo
    {
        return $this->belongsTo(Flow::class);
    }

    public static function getInitialPosition(int $flowId): int
    {
        $lastPosition = static
            ::where('flow_id', $flowId)
            ->max('position');

        return ($lastPosition ?? self::INITIAL_POSITION) + self::POSITION_GAP;
    }

    public static function needsRebalancing(FlowActivity $flowActivity): bool
    {
        return Flow
            ::where('flow_id', $flowActivity->flow_id)
            ->where(function ($query) use ($flowActivity) {
                $query->whereBetween('position', [
                    $flowActivity->position - Flow::POSITION_GAP / 4,
                    $flowActivity->position + Flow::POSITION_GAP / 4
                ])
                    ->where('id', '!=', $flowActivity->id);
            })
            ->exists();
    }

    public function moveUp(): void
    {
        $previous = static
            ::where('flow_id', $this->flow_id)
            ->where('position', '<', $this->position)
            ->orderBy('position', 'desc')
            ->first();

        if ($previous) {
            $newPosition = $previous->position - (self::POSITION_GAP / 2);
            $this->position = (int)$newPosition;
            $this->save();
        }
    }

    public function moveDown(): void
    {
        $next = static
            ::where('flow_id', $this->flow_id)
            ->where('position', '>', $this->position)
            ->orderBy('position')
            ->first();

        if ($next) {
            $newPosition = $next->position + (self::POSITION_GAP / 2);
            $this->position = (int)$newPosition;
            $this->save();
        }
    }

    public function rebalancePositions(): void
    {
        $flows = static
            ::where('flow_id', $this->flow_id)
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
