<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttemptModule extends Model
{
    protected $fillable = [
        'module_id',
        'name',
        'description',
        'icon',
        'color',
        'order',
        'is_completed'
    ];

    public function activities(): HasMany
    {
        return $this
            ->hasMany(AttemptModuleActivity::class)
            ->orderBy('order');
    }
}
