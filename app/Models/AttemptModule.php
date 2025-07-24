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
    protected $table = 'attempt_modules';

    public $incrementing = true;

    protected $fillable = [
        'attempt_id',
        'module_id',
        'name',
        'description',
        'icon',
        'color',
        'position',
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
            ->orderBy('position');
    }


    public function originalModule(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id')->withTrashed();
    }

    public function nextModule(): ?self
    {
        // Find the next module by order, ensuring robustness
        return $this->attempt->modules()
                  ->where('position', '>', $this->position)
                  ->orderBy('position', 'asc')
                  ->first();
    }

    public function isCompleted(): bool
    {
        // A module is completed if it has activities and none of them are unanswered (is_correct is not null)
        $totalActivities = $this->activities()->count();
        if ($totalActivities === 0) {
            return true; // Consider modules with no activities completed by default?
        }
        $answeredActivities = $this->activities()->whereNotNull('is_correct')->count();
        return $totalActivities === $answeredActivities;
        
        // Alternative stricter check: Ensure *no* activity exists where is_correct IS null.
        // return !$this->activities()->whereNull('is_correct')->exists(); 
    }
}
