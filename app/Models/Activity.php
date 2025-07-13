<?php

namespace App\Models;

use App\Enums\OperationType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany};
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'content',
        'type',
        'operation',
        'owner_id',
    ];

    protected $casts = [
        'content'   => 'array',
        'operation' => OperationType::class,
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'module_activity')
                    ->withPivot('position')
                    ->orderBy('module_activity.position');
    }

    public function room()
    {
        return $this->modules()->first()?->rooms()->first();
    }
}
