<?php

namespace App\Models\Abstracts;

use Illuminate\Database\Eloquent\Model;

abstract class PositionableModel extends Model
{
    protected static int $positionGap     = 1000;
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
        $column = $this->getPositionGroupColumn();
        $groupValue = $this->getPositionGroupValue();

        $previous = static::where($column, $groupValue)
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
        $column = $this->getPositionGroupColumn();
        $groupValue = $this->getPositionGroupValue();

        $next = static::where($column, $groupValue)
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
        $column = $this->getPositionGroupColumn();
        $groupValue = $this->getPositionGroupValue();

        $items = static::where($column, $groupValue)
            ->orderBy('position')
            ->get();

        $position = static::$initialPosition;

        foreach ($items as $item) {
            $item->position = $position;
            $item->save();
            $position += static::$positionGap;
        }
    }

    protected function needsRebalancing(): bool
    {
        $column = $this->getPositionGroupColumn();
        $groupValue = $this->getPositionGroupValue();

        return static::where($column, $groupValue)
            ->where(function ($query) {
                $query->whereBetween('position', [
                    $this->position - static::$positionGap / 4,
                    $this->position + static::$positionGap / 4
                ])
                    ->where('id', '!=', $this->id);
            })
            ->exists();
    }
}
