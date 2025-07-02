<?php

namespace App\Models;

use App\Enums\Operation;
use App\Enums\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Module extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'icon',
        'description',
        'color',
        'operation',
        'type',
        'owner_id'
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
        return $this->belongsTo(User::class, 'owner_id');
    }
}
