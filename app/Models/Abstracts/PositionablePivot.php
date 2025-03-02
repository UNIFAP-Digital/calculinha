<?php

namespace App\Models\Abstracts;

use App\Models\Contracts\Positionable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Pivot;

abstract class PositionablePivot extends Pivot implements Positionable
{
    public static int    $positionGap     = 1000;
    protected static int $initialPosition = 10000;

    abstract public function getPositionGroupColumn(): string;

    public function getPositionGroupValue(): int
    {
        $column = $this->getPositionGroupColumn();
        return $this->$column;
    }

    public static function getInitialPosition(int $groupValue): int
    {
        $model = new static;
        $column = $model->getPositionGroupColumn();

        $lastPosition = static::where($column, $groupValue)->max('position');
        return ($lastPosition ?? static::$initialPosition) + static::$positionGap;
    }

    public function moveUp(): void
    {
        $query = $this->getPivotQuery();

        $previous = $query
            ->where('position', '<', $this->position)
            ->orderBy('position', 'desc')
            ->first();

        if ($previous) {
            $newPosition = $previous->position - (static::$positionGap / 2);
            $this->position = (int)$newPosition;
            $this->save();

            if ($this->needsRebalancing()) {
                $this->rebalancePositions();
            }
        }
    }

    public function moveDown(): void
    {
        $query = $this->getPivotQuery();

        $next = $query
            ->where('position', '>', $this->position)
            ->orderBy('position')
            ->first();

        if ($next) {
            $newPosition = $next->position + (static::$positionGap / 2);
            $this->position = (int)$newPosition;
            $this->save();

            if ($this->needsRebalancing()) {
                $this->rebalancePositions();
            }
        }
    }

    public function rebalancePositions(): void
    {
        $query = $this->getPivotQuery();
        $items = $query->orderBy('position')->get();
        $position = static::$initialPosition;

        foreach ($items as $item) {
            $item->position = $position;
            $item->save();
            $position += static::$positionGap;
        }
    }

    protected function needsRebalancing(): bool
    {
        $query = $this->getPivotQuery();

        return $query
            ->where(function ($query) {
                $query->whereBetween('position', [
                    $this->position - static::$positionGap / 4,
                    $this->position + static::$positionGap / 4
                ])
                    ->where('id', '!=', $this->id);
            })
            ->exists();
    }

    protected function getPivotQuery(): Builder
    {
        $column = $this->getPositionGroupColumn();
        $groupValue = $this->getPositionGroupValue();

        return static::where($column, $groupValue);
    }
}
