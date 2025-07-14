<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany};
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;
use Random\RandomException;

class Room extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'invite_code',
        'owner_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /* -------------------------------------------------
     |  Boot
     * -------------------------------------------------*/
    protected static function booted(): void
    {
        static::creating(fn (Room $room) => $room->invite_code ??= static::generateInviteCode());
    }

    /* -------------------------------------------------
     |  Relations
     * -------------------------------------------------*/
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'room_module')
                    ->withPivot('position')
                    ->orderBy('room_module.position');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'attempts.room_id')
                    ->distinct();
    }

    /* -------------------------------------------------
     |  Helpers
     * -------------------------------------------------*/
    public function activitiesOrdered(): \Illuminate\Support\Collection
    {
        return $this->modules()
                    ->with('activities')
                    ->get()
                    ->flatMap(
                        fn (Module $m) =>
                        $m->activities->map->setRelation('module', $m)
                    );
    }

    /**
     * @throws RandomException
     */
    private static function generateInviteCode(): string
    {
        do {
            $code = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (static::where('invite_code', $code)->exists());

        return $code;
    }

    /* Factory Methods */
    public static function createWithModules(
        string $name,
        array $modules,
        int $ownerId
    ): self {
        $room = self::create([
            'name' => $name,
            'owner_id' => $ownerId,
            'is_active' => true,
        ]);

        $room->addModules($modules);

        return $room;
    }

    /* Module Management */
    public function addModules(array $modules): void
    {
        $this->modules()->syncWithPivotValues(
            collect($modules)->pluck('id'),
            collect($modules)->mapWithKeys(fn ($module, $index) => [
                $module->id => ['position' => $index]
            ])->toArray()
        );
    }

    public function addModule(Module $module, int $position = null): void
    {
        if ($position === null) {
            $position = $this->modules()->count();
        }

        $this->modules()->attach($module->id, ['position' => $position]);
    }

    public function removeModule(Module $module): void
    {
        $this->modules()->detach($module->id);
    }

    public function reorderModules(array $moduleIds): void
    {
        $this->modules()->syncWithPivotValues(
            $moduleIds,
            collect($moduleIds)->mapWithKeys(fn ($id, $index) => [
                $id => ['position' => $index]
            ])->toArray()
        );
    }

    /* Progress Tracking */
    public function getProgressForUser(User $user): array
    {
        $modules = $this->modules()->withCount('activities')->get();
        $totalActivities = $modules->sum('activities_count');

        $completedActivities = $this->modules()
            ->with(['activities' => function ($query) use ($user) {
                $query->whereHas('attempts', function ($q) use ($user) {
                    $q->where('student_id', $user->id)
                      ->where('correct', true);
                });
            }])
            ->get()
            ->flatMap->activities
            ->count();

        return [
            'total_activities' => $totalActivities,
            'completed_activities' => $completedActivities,
            'percentage' => $totalActivities > 0 ? round(($completedActivities / $totalActivities) * 100) : 0,
        ];
    }

    public function getModuleProgressForUser(User $user): array
    {
        return $this->modules
            ->mapWithKeys(function ($module) use ($user) {
                $progress = $module->getProgressForUser($user);
                return [$module->id => $progress];
            })
            ->toArray();
    }

    /* Business Logic */
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
        return $this->isOwner($user) && $this->attempts()->count() === 0;
    }

    public function isActive(): bool
    {
        return $this->is_active;
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    /* Content Analysis */
    public function getTotalActivitiesCount(): int
    {
        return $this->modules()->withCount('activities')->get()->sum('activities_count');
    }

    public function getModulesList(): array
    {
        return $this->modules
            ->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->name,
                    'type' => $module->type,
                    'operation' => $module->operation,
                    'activities_count' => $module->getTotalActivitiesCount(),
                    'is_complete' => $module->isComplete(),
                ];
            })
            ->toArray();
    }

    public function getAllActivities(): \Illuminate\Support\Collection
    {
        return $this->modules()
            ->with(['activities' => function ($query) {
                $query->orderBy('module_activity.position');
            }])
            ->get()
            ->flatMap(function ($module) {
                return $module->activities->map(function ($activity) use ($module) {
                    return [
                        'id' => $activity->id,
                        'question' => $activity->getQuestion(),
                        'options' => $activity->getOptions(),
                        'correct' => $activity->getCorrectAnswer(),
                        'module_id' => $module->id,
                        'module_name' => $module->name,
                        'operation' => $module->operation,
                    ];
                });
            });
    }

    public function hasUser(User $user): bool
    {
        return $this->attempts()->where('student_id', $user->id)->exists();
    }

    public function getStudentCount(): int
    {
        return $this->students()->count();
    }

    public function getAverageScore(): float
    {
        return $this->attempts()->avg('score') ?? 0;
    }

    public function getCompletionRate(): float
    {
        $students = $this->getStudentCount();
        if ($students === 0) {
            return 0;
        }

        $completed = $this->attempts()->where('completed', true)->count();
        return round(($completed / $students) * 100, 2);
    }

    /* Validation */
    public function validateRoom(): void
    {
        if (empty($this->name)) {
            throw ValidationException::withMessages([
                'name' => 'Room name is required.'
            ]);
        }

        if ($this->modules()->count() === 0) {
            throw ValidationException::withMessages([
                'modules' => 'Room must have at least one module.'
            ]);
        }
    }
}
