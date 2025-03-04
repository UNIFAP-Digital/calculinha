<?php

namespace App\Enums;

enum Status: string
{
    case Completed = 'completed';
    case Current   = 'current';
    case Locked    = 'locked';
}
