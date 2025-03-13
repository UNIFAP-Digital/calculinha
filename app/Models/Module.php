<?php

namespace App\Models;

use App\Enums\Operation;
use App\Enums\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Module extends Model
{
    protected $fillable = [
        'room_id',
        'name',
        'icon',
        'description',
        'color',
        'position',
        'operation',
        'type'
    ];

    protected $casts = [
        'operation' => Operation::class,
        'type'      => Type::class,
    ];

    public function activities(): BelongsToMany
    {
        return $this
            ->belongsToMany(Activity::class, 'module_activity')
            ->using(ModuleActivity::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
