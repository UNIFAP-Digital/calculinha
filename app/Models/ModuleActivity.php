<?php

namespace App\Models;

use App\Models\Abstracts\PositionablePivot;

class ModuleActivity extends PositionablePivot
{
    public $incrementing = true;
    public $timestamps   = false;

    public function getPositionGroupColumn(): string
    {
        return 'module_id';
    }
}
