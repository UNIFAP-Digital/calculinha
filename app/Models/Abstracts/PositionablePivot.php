<?php

namespace App\Models\Abstracts;

use App\Models\Contracts\Positionable;
use App\Models\RoomModule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Pivot;

abstract class PositionablePivot extends Pivot implements Positionable
{
    public static int $positionGap     = 1000;
    public static int $initialPosition = 10000;

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
        $query = $this->getPivotSelectQuery();

        /** @var RoomModule $previous */
        $previous = $query
            ->where('position', '<', $this->position)
            ->orderBy('position', 'desc')
            ->first();

        if ($previous) {
            $newPosition = $previous->position - (static::$positionGap / 2);

            $this->getPivotUpdateQuery()->update([
                'position' => $newPosition,
            ]);

            if ($this->needsRebalancing()) {
                $this->rebalancePositions();
            }
        }
    }

    public function moveDown(): void
    {
        $query = $this->getPivotSelectQuery();

        $next = $query
            ->where('position', '>', $this->position)
            ->orderBy('position')
            ->first();

        if ($next) {
            $newPosition = $next->position + (static::$positionGap / 2);

            $this->getPivotUpdateQuery()->update([
                'position' => $newPosition,
            ]);

            if ($this->needsRebalancing()) {
                $this->rebalancePositions();
            }
        }
    }

    public function rebalancePositions(): void
    {
        $query = $this->getPivotSelectQuery();
        $items = $query->orderBy('position')->get();
        $position = static::$initialPosition;

        foreach ($items as $item) {
            $this->getPivotUpdateQuery($item)->update([
                'position' => $position,
            ]);

            $position += static::$positionGap;
        }
    }

    protected function needsRebalancing(): bool
    {
        return $this->getPivotSelectQuery()
            ->whereBetween('position', [
                $this->position - static::$positionGap / 4,
                $this->position + static::$positionGap / 4
            ])
            ->exists();
    }

    protected function getPivotSelectQuery(): Builder
    {
        return static
            ::where($this->getPositionGroupColumn(), $this->getPositionGroupValue());
    }

    protected function getPivotUpdateQuery($model = null): Builder
    {
        $targetModel = $model ?? $this;

        return static
            ::where($this->getForeignKey(), $targetModel->getAttribute($this->getForeignKey()))
            ->where($this->getRelatedKey(), $targetModel->getAttribute($this->getRelatedKey()));
    }
}
