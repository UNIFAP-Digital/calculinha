<?php

namespace App\Models;

use App\Enums\{App\Enums\OperationType, App\Enums\ModuleType};
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany};
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
        'owner_id',
    ];

    protected $casts = [
        'operation' => OperationType::class,
        'type'      => ModuleType::class,
    ];

    /* -------------------------------------------------
     |  Relations
     * -------------------------------------------------*/
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'module_activity')
                    ->withPivot('position')
                    ->orderBy('module_activity.position');
    }

    public function rooms(): BelongsToMany
    {
        return $this->belongsToMany(Room::class, 'room_module')
                    ->withPivot('position')
                    ->orderBy('room_module.position');
    }

    /* -------------------------------------------------
     |  Scopes
     * -------------------------------------------------*/
    public function scopeWithoutAllOperation($query)
    {
        $query->where('operation', '!=', OperationType::All);
    }
}
