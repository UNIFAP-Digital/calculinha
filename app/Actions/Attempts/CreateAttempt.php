<?php

namespace App\Actions\Attempts;

use App\Models\Attempt;
use App\Models\Room;
use App\Models\Student;
use App\Enums\Status;
use Illuminate\Support\Arr; // Added for Arr::isAssoc if needed, or other helpers
use Illuminate\Support\Facades\DB; // For potential transaction wrapping if needed

class CreateAttempt
{
    /**
     * Create a new attempt for a student in a specific room,
     * snapshotting the room's modules and activities at this point in time.
     *
     * @param Room $room The room the attempt is for.
     * @param Student $student The student making the attempt.
     * @return Attempt The newly created attempt.
     */
    public function execute(Room $room, Student $student): Attempt
    {
        // Consider wrapping in transaction if multiple saves occur and atomicity is crucial
        // DB::transaction(function () use ($room, $student, &$attempt) { ... });
        
        $attempt = Attempt::create([ // Use standard Eloquent create
            'room_id'    => $room->id,
            'student_id' => $student->id,
            'status'     => Status::Current,
            // Calculate attempt number safely
            'number'     => Attempt::where('room_id', $room->id)->where('student_id', $student->id)->count() + 1
        ]);

        // Fetch the modules associated with the room, in their defined order, with their activities
        // Ensure we only fetch modules linked via the pivot and respect soft deletes on modules/activities implicitly
        $roomModules = $room->modules()->with(['activities' => function ($query) {
            // Explicitly ensure activities are not soft-deleted, though default Eloquent usually handles this
             $query->whereNull('activities.deleted_at'); 
        }])->get();

        if ($roomModules->isEmpty()) {
            // Handle edge case: Room has no modules (maybe throw exception or log warning?)
            // For now, return the attempt with no modules attached.
             return $attempt;
        }

        $firstModulePosition = $roomModules->first()->pivot->position;

        // Create AttemptModule snapshots for each module in the room
        foreach ($roomModules as $module) {
            $moduleActivities = $module->activities
                ->map(fn($activity, $idx) => [
                    // Added check for $activity existence just in case
                    // Although ->activities relationship should not yield nulls
                    'activity_id' => $activity?->id,
                    'type'        => $activity?->type,
                    // Convert enum to its string value explicitly
                    'operation'   => $activity?->operation?->value, // Access enum's value property
                    'content'     => $activity?->content,
                    'position'       => $idx + 1
                ])
                ->filter() // <-- IMPORTANT: Remove any null/false results from map
                ->values() // <-- Optional: Reset keys to 0, 1, 2...
                ->all();

            $attemptModule = $attempt->modules()->create([
                'module_id'   => $module->id,             // Link to original module
                'operation'   => $module->operation?->value, // Convert enum to string value
                'name'        => $module->name,           // Snapshot
                'description' => $module->description,    // Snapshot
                // Consider snapshotting 'icon', 'color' if needed historically
                // 'icon'        => $module->icon,
                // 'color'       => $module->color,
                'position'       => $module->pivot->position, // Use position from room_module pivot for sequence
                'status'      => $module->pivot->position === $firstModulePosition
                                    ? Status::Current      // Unlock only the first module
                                    : Status::Locked,
                'type'        => $module->type?->value,   // Convert enum to string value
            ]);

            // Use Eloquent's model-based approach for activities
            if (!empty($moduleActivities)) {
                // Improved method using proper Eloquent Model instances
                // This avoids array-to-model conversion issues that might occur in createMany
                foreach ($moduleActivities as $activityData) {
                    try {
                        // Create a proper model instance first
                        $attemptModuleActivity = new \App\Models\AttemptModuleActivity();
                        $attemptModuleActivity->attempt_module_id = $attemptModule->id;
                        $attemptModuleActivity->activity_id = $activityData['activity_id'] ?? null;
                        $attemptModuleActivity->type = $activityData['type'];
                        
                        // Handle enum properly
                        if (isset($activityData['operation'])) {
                            if (is_object($activityData['operation']) && method_exists($activityData['operation'], 'value')) {
                                $attemptModuleActivity->operation = $activityData['operation']->value;
                            } else {
                                $attemptModuleActivity->operation = $activityData['operation'];
                            }
                        }
                        
                        $attemptModuleActivity->content = $activityData['content'];
                        $attemptModuleActivity->position = $activityData['position'];
                        
                        // Save using the relationship to ensure proper association
                        $attemptModule->activities()->save($attemptModuleActivity);
                    } catch (\Exception $e) {
                        // Log but continue with other activities
                        \Log::warning("Failed to create an activity: " . $e->getMessage(), [
                            'data' => $activityData,
                            'module_id' => $module->id
                        ]);
                    }
                }
            }
        }

        return $attempt;
        // }); // End DB::transaction if used
    }
} 
