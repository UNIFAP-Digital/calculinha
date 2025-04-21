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

        // Fetch only active modules and their active activities for the new attempt
        $activeRoomModules = $room->modules()->with(['activities' => fn ($query) => $query->whereNull('activities.deleted_at')])->get();

        // Collect all active activities from the active modules for potential use in pre/post tests
        $allActiveActivities = $activeRoomModules->reduce(fn($carry, $module) => $carry->merge($module->activities), collect());

        $order = 1;

        // Pre-Test Module (using random sample of active activities from the room)
        $preTestActivities = $allActiveActivities
            ->whenNotEmpty(fn ($collection) => $collection->random(min(12, $collection->count())))
            ->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'type'        => $activity->type,
                'operation'   => $activity->operation,
                'content'     => $activity->content, // Snapshot content
                'order'       => $idx + 1
            ])->all();

        if (!empty($preTestActivities)) {
             $attempt
                ->modules()
                ->create(['order' => $order++, 'status' => Status::Current, 'type' => Type::PreTest]) // Initially unlocked
                ->activities()
                ->createMany($preTestActivities);
        } else {
             // Handle case with no activities? Maybe skip pre-test or throw error?
             // For now, let's assume a room must have activities. If not, this attempt might be invalid.
             // If pre-test is skipped, ensure the first exercise module is unlocked.
             $attempt->modules()->create(['order' => $order++, 'status' => Status::Current, 'type' => Type::PreTest]); // Create empty pre-test? Or adjust logic
        }


        // Exercise Modules (snapshotting data from active room modules)
        foreach ($activeRoomModules as $module) {
            $moduleActivities = $module->activities // Already filtered for active activities
                ->map(fn($activity, $idx) => [
                    'activity_id' => $activity->id, // Link to original (active) activity
                    'type'        => $activity->type, // Snapshot
                    'operation'   => $activity->operation, // Snapshot
                    'content'     => $activity->content, // Snapshot
                    'order'       => $idx + 1
                ])->all();

            $attemptModule = $attempt
                ->modules()
                ->create([
                    'module_id'   => $module->id, // Link to original module
                    'operation'   => $module->operation, // Snapshot
                    'name'        => $module->name, // Snapshot
                    'description' => $module->description, // Snapshot
                    'order'       => $order++,
                    // Lock subsequent modules if pre-test exists and had activities
                    'status'      => ($order === 3 && !empty($preTestActivities)) ? Status::Locked : (($order === 2 && empty($preTestActivities)) ? Status::Current : Status::Locked),
                    'type'        => Type::Exercise,
                ]);

            if (!empty($moduleActivities)) {
                $attemptModule->activities()->createMany($moduleActivities);
            }
        }

        // Post-Test Module (using random sample of active activities from the room)
        $postTestActivities = $allActiveActivities
            ->whenNotEmpty(fn ($collection) => $collection->random(min(12, $collection->count())))
            ->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'type'        => $activity->type,
                'operation'   => $activity->operation,
                'content'     => $activity->content,
                'order'       => $idx + 1
            ])->all();

        if (!empty($postTestActivities)) {
             $attempt
                ->modules()
                ->create(['order' => $order, 'status' => Status::Locked, 'type' => Type::PostTest])
                ->activities()
                ->createMany($postTestActivities);
        } else {
             // Handle case with no activities? Maybe skip post-test.
             $attempt->modules()->create(['order' => $order, 'status' => Status::Locked, 'type' => Type::PostTest]);
        }


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
