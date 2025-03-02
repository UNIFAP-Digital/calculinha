<?php

namespace App\Models\Contracts;

interface Positionable
{
    public function getPositionGroupColumn(): string;

    public function getPositionGroupValue(): int;

    public function moveUp(): void;

    public function moveDown(): void;

    public function rebalancePositions(): void;
}
