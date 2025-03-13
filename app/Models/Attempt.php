<?php

namespace App\Models;

use App\Enums\Status;
use App\Enums\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attempt extends Model
{
    protected $fillable = [
        'student_id',
        'room_id',
        'status',
        'number'
    ];

    protected $casts = [
        'status' => Status::class
    ];

    public function modules(): HasMany
    {
        return $this
            ->hasMany(AttemptModule::class)
            ->orderBy('order');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public static function current(Room $room, Student $student): Attempt
    {
        $attempt = $room
            ->attempts()
            ->whereStudentId($student->id)
            ->whereStatus(Status::Current)
            ->first();

        return $attempt ?? static::create($room, $student);
    }

    public static function fake(Room $room): Attempt
    {
        $modules = $room->modules()->with('activities')->get()->map(function ($module, $idx) {
            $module->setAttribute('status', $idx === 0 ? Status::Current : Status::Locked);
            $module->setAttribute('activities_count', $module->activities()->count());
            $module->setAttribute('activities_completed', 0);
            return $module;
        });

        return Attempt
            ::make(['room_id' => $room->id, 'status' => Status::Current, 'number' => 1])
            ->updateTimestamps()
            ->setRelation('modules', $modules);
    }

    public static function hasAny(Room $room, Student $student): bool
    {
        return $room->attempts()->whereStudentId($student->id)->exists();
    }

    private static function numberOfAttempts(Room $room, Student $student): int
    {
        return $room->attempts()->whereStudentId($student->id)->count();
    }

    private static function create(Room $room, Student $student): Attempt
    {
        $attempt = parent::create([
            'room_id'    => $room->id,
            'student_id' => $student->id,
            'status'     => Status::Current,
            'number'     => static::numberOfAttempts($room, $student) + 1
        ]);
        $activities = $room->modules->reduce(fn($activities, $module) => $activities->merge($module->activities), collect());
        $order = 1;

        $initialActivities = $activities
            ->shuffle()
            ->take(12)
            ->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'type'        => $activity->type,
                'operation'   => $activity->operation,
                'content'     => $activity->content,
                'order'       => $idx + 1
            ]);

        $attempt
            ->modules()
            ->create(['order' => $order++, 'status' => Status::Current, 'type' => Type::PreTest])
            ->activities()
            ->createMany($initialActivities);

        foreach ($room->modules as $module) {
            $moduleActivities = $module->activities->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'type'        => $activity->type,
                'operation'   => $activity->operation,
                'content'     => $activity->content,
                'order'       => $idx + 1
            ]);

            $attempt
                ->modules()
                ->create([
                    'module_id'   => $module->id,
                    'operation'   => $module->operation,
                    'name'        => $module->name,
                    'description' => $module->description,
                    'order'       => $order++,
                    'status'      => Status::Locked,
                    'type'        => Type::Exercise,
                ])
                ->activities()
                ->createMany($moduleActivities);
        }

        $finalActivities = $activities
            ->shuffle()
            ->take(12)
            ->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'type'        => $activity->type,
                'operation'   => $activity->operation,
                'content'     => $activity->content,
                'order'       => $idx + 1
            ]);

        $attempt
            ->modules()
            ->create(['order' => $order, 'status' => Status::Locked, 'type' => Type::PostTest])
            ->activities()
            ->createMany($finalActivities);

        return $attempt;
    }

    public function advanceModule(): void
    {
        $currentModule = $this->modules()->firstWhere('status', Status::Current);

        if (!$currentModule) return;

        $currentModule->status = Status::Locked;
        $currentModule->save();

        $nextModule = $currentModule->nextModule();

        if ($nextModule) {
            $nextModule->status = Status::Current;
            $nextModule->save();
        }
    }
}
