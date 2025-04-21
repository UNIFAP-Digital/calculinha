<?php

namespace App\Models;

use App\Enums\Operation;
use App\Enums\Status;
use App\Enums\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AttemptModule extends Pivot
{
    protected $table = 'attempt_modules';

    public $incrementing = true;

    protected $fillable = [
        'attempt_id',
        'module_id',
        'name',
        'description',
        'icon',
        'color',
        'order',
        'status',
        'operation',
        'type'
    ];

    protected $casts = [
        'status'    => Status::class,
        'operation' => Operation::class,
        'type'      => Type::class,
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(Attempt::class);
    }

    public function activities(): HasMany
    {
        return $this
            ->hasMany(AttemptModuleActivity::class)
            ->orderBy('order');
    }

    /**
     * Get the original Module, including soft-deleted ones.
     */
    public function originalModule(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id')->withTrashed();
    }

    public function nextModule(): ?self
    {
        return self::whereAttemptId($this->attempt_id)->whereOrder($this->order + 1)->first();
    }

    public function isCompleted(): bool
    {
        return $this->activities()->whereNull('is_correct')->exists();
    }
}
