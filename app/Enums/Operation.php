<?php

namespace App\Enums;

enum Operation: string
{
    case Addition       = 'addition';
    case Subtraction    = 'subtraction';
    case Multiplication = 'multiplication';
    case Division       = 'division';
}
