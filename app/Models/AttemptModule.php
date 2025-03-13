<?php

namespace App\Models;

use App\Enums\Operation;
use App\Enums\Status;
use App\Enums\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    public function nextModule(): ?AttemptModule
    {
        return $this
            ->attempt
            ->modules()
            ->where('order', '>', $this->order)
            ->first();
    }

    public function isCompleted(): bool
    {
        return $this->activities()->whereNull('is_correct')->exists();
    }
}
