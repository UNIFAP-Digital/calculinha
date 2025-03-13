<?php

namespace App\Enums;

enum Type: string
{
    case PreTest  = 'pre-test';
    case Exercise = 'exercise';
    case PostTest = 'post-test';
}
