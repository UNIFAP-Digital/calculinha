<?php

namespace App\Enums;

enum OperationType: string
{
    case All       = 'all';
    case Addition       = 'addition';
    case Subtraction    = 'subtraction';
    case Multiplication = 'multiplication';
    case Division       = 'division';
}
