<?php

namespace App\Models;

use App\Enums\Status;
use App\Enums\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Actions\Attempts\CreateAttempt;

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

    /**
     * Get the student's current, active attempt for a room, or create one.
     */
    public static function current(Room $room, Student $student): Attempt
    {
        $attempt = $room
            ->attempts()
            ->where('student_id', $student->id)
            ->where('status', Status::Current)
            ->first();

        return $attempt ?? app(CreateAttempt::class)->execute($room, $student);
    }

    public static function fake(Room $room): Attempt
    {
        // Create a fake attempt instance
        $attempt = Attempt::make([
            'room_id'    => $room->id, 
            'student_id' => Student::factory()->create()->id, // Need a student
            'status'     => Status::Current, 
            'number'     => 1
        ])->setRelation('room', $room);

        // Fetch actual room modules with activities and pivot data
        $roomModules = $room->modules()->with('activities')->get();

        // Create fake AttemptModule relations mirroring the real structure
        $attemptModules = $roomModules->map(function ($module) use ($attempt, $roomModules) {
            $attemptModule = AttemptModule::make([
                'attempt_id'  => $attempt->id, // Needs an ID, but we are faking
                'module_id'   => $module->id,
                'operation'   => $module->operation,
                'name'        => $module->name,
                'description' => $module->description,
                'order'       => $module->pivot->position,
                'status'      => $module->pivot->position === ($roomModules->first()->pivot->position ?? null)
                                        ? Status::Current 
                                        : Status::Locked,
                'type'        => $module->type,
            ]);

            // Create fake AttemptModuleActivity relations
            $activities = $module->activities->map(function ($activity, $idx) use ($attemptModule) {
                return AttemptModuleActivity::make([
                    'attempt_module_id' => $attemptModule->id, // Needs an ID
                    'activity_id'       => $activity->id,
                    'type'              => $activity->type,
                    'operation'         => $activity->operation,
                    'content'           => $activity->content,
                    'order'             => $idx + 1,
                    'answer'            => null,
                    'is_correct'        => null,
                ]);
            });
            $attemptModule->setRelation('activities', $activities);
            $attemptModule->setAttribute('activities_count', $activities->count()); // Add count for UI
            $attemptModule->setAttribute('activities_completed', 0); // Add completed count for UI

            return $attemptModule;
        });

        // Set the relations on the fake attempt
        $attempt->setRelation('modules', $attemptModules);
        
        // We don't save the fake attempt or its relations to DB
        return $attempt;
    }

    public static function hasAny(Room $room, Student $student): bool
    {
        return $room->attempts()->whereStudentId($student->id)->exists();
    }

    private static function numberOfAttempts(Room $room, Student $student): int
    {
        return $room->attempts()->whereStudentId($student->id)->count();
    }

    public function advanceModule(): void
    {
        $currentModule = $this->modules()->where('status', Status::Current)->first();

        if (!$currentModule) return; // Already completed or no current module found

        $currentModule->status = Status::Locked; 
        $currentModule->save();

        // Find the next module in sequence using the order field
        $nextModule = $this->modules()
                           ->where('order', '>', $currentModule->order)
                           ->orderBy('order', 'asc')
                           ->first();

        if ($nextModule) {
            $nextModule->status = Status::Current;
            $nextModule->save();
        } else {
            $this->status = Status::Completed;
            $this->save();
        }
    }
}
