<?php

namespace App\Models;

use App\Enums\{OperationType, ModuleType};
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
        'no_feedback',
        'owner_id',
    ];

    protected $casts = [
        'operation' => OperationType::class,
        'type'      => ModuleType::class,
        'no_feedback' => 'boolean',
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

    /* Factory Methods */
    public static function createWithActivities(
        string $name,
        string $description,
        ModuleType $type,
        OperationType $operation,
        array $activitiesData,
        int $ownerId
    ): self {
        $module = self::create([
            'name' => $name,
            'description' => $description,
            'type' => $type,
            'operation' => $operation,
            'owner_id' => $ownerId,
        ]);

        $module->addActivities($activitiesData);

        return $module;
    }

    /* Activity Management */
    public function addActivities(array $activitiesData): void
    {
        $activities = collect();

        foreach ($activitiesData as $index => $activityData) {
            $activity = Activity::createMultipleChoice(
                $activityData['question'],
                $activityData['options'],
                $activityData['correct_index'],
                $this->operation,
                $this->owner_id
            );

            $activities->push($activity);
        }

        $this->activities()->syncWithPivotValues(
            $activities->pluck('id'),
            collect($activities)->mapWithKeys(fn($activity, $index) => [$activity->id => ['position' => $index]])->toArray()
        );
    }

    public function generateActivitiesFromTemplates(array $templates, int $count = 10): void
    {
        $activities = Activity::generateBatchFromTemplates($templates, $this->owner_id, $count);
        
        $this->activities()->syncWithPivotValues(
            collect($activities)->pluck('id'),
            collect($activities)->mapWithKeys(fn($activity, $index) => [$activity->id => ['position' => $index]])->toArray()
        );
    }

    /* Validation and Business Logic */
    public function isComplete(): bool
    {
        return $this->activities()->count() > 0;
    }

    public function getProgressForUser(User $user): array
    {
        $total = $this->activities()->count();
        $completed = $this->activities()
            ->whereHas('attempts', function ($query) use ($user) {
                $query->where('student_id', $user->id)
                      ->where('correct', true);
            })
            ->count();

        return [
            'total' => $total,
            'completed' => $completed,
            'percentage' => $total > 0 ? round(($completed / $total) * 100) : 0,
        ];
    }

    public function isOwner(User $user): bool
    {
        return $this->owner_id === $user->id;
    }

    public function canBeEditedBy(User $user): bool
    {
        return $this->isOwner($user);
    }

    public function canBeDeletedBy(User $user): bool
    {
        return $this->isOwner($user) && $this->rooms()->count() === 0;
    }

    /* Content Analysis */
    public function getTotalActivitiesCount(): int
    {
        return $this->activities()->count();
    }

    public function getActivitiesList(): array
    {
        return $this->activities
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'question' => $activity->getQuestion(),
                    'options' => $activity->getOptions(),
                    'correct' => $activity->getCorrectAnswer(),
                ];
            })
            ->toArray();
    }

    public function getDifficultyDistribution(): array
    {
        return $this->activities
            ->groupBy(fn($activity) => $activity->getDifficulty())
            ->map->count()
            ->toArray();
    }

    /* Room Management */
    public function addToRoom(Room $room, int $position = null): void
    {
        if ($position === null) {
            $position = $room->modules()->count();
        }

        $room->modules()->attach($this->id, ['position' => $position]);
    }

    public function removeFromRoom(Room $room): void
    {
        $room->modules()->detach($this->id);
    }

    /* Validation */
    public function validateModule(): void
    {
        if (empty($this->name)) {
            throw ValidationException::withMessages([
                'name' => 'Module name is required.'
            ]);
        }

        if (empty($this->description)) {
            throw ValidationException::withMessages([
                'description' => 'Module description is required.'
            ]);
        }
    }
}
