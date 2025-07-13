<?php

namespace App\Enums;

enum ModuleStatusType: string
{
    case Completed = 'completed';
    case Current   = 'current';
    case Locked    = 'locked';
}
