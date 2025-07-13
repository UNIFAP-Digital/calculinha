<?php

namespace App\Enums;

enum ModuleType: string
{
    case PreTest  = 'pre-test';
    case Regular = 'regular';
    case PostTest = 'post-test';
}
