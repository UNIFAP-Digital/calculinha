<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attempt extends Model
{
    protected $fillable = [
        'student_id',
        'room_id',
        'is_completed'
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
            ->whereIsCompleted(false)
            ->orderBy('created_at')
            ->first();

        return $attempt ?? static::create($room, $student);
    }

    public static function fake(Room $room): Attempt
    {
        $modules = $room->modules()->with('activities')->get();

        return Attempt
            ::make(['room_id' => $room->id, 'is_completed' => false])
            ->updateTimestamps()
            ->setRelation('modules', $modules);
    }

    public static function hasAny(Room $room, Student $student): bool
    {
        return $room->attempts()->whereStudentId($student->id)->exists();
    }

    private static function create(Room $room, Student $student): Attempt
    {
        $attempt = parent::create([
            'room_id'    => $room->id,
            'student_id' => $student->id,
        ]);
        $activities = $room->modules->reduce(fn($activities, $module) => $activities->merge($module->activities), collect());
        $order = 1;

        $initialActivities = $activities
            ->shuffle()
            ->take(12)
            ->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'content'     => $activity->content,
                'order'       => $idx + 1,
            ]);

        $attempt
            ->modules()
            ->create(['order' => $order++])
            ->activities()
            ->createMany($initialActivities);

        foreach ($room->modules as $module) {
            $moduleActivities = $module->activities->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'content'     => $activity->content,
                'order'       => $idx + 1
            ]);

            $attempt
                ->modules()
                ->create([
                    'module_id'   => $module->id,
                    'name'        => $module->name,
                    'description' => $module->description,
                    'icon'        => $module->icon,
                    'color'       => $module->color,
                    'order'       => $order++,
                ])
                ->activities()
                ->createMany($moduleActivities);
        }

        $finalActivities = $activities
            ->shuffle()
            ->take(12)
            ->map(fn($activity, $idx) => [
                'activity_id' => $activity->id,
                'content'     => $activity->content,
                'order'       => $idx + 1,
            ]);

        $attempt
            ->modules()
            ->create(['order' => $order])
            ->activities()
            ->createMany($finalActivities);

        return $attempt;
    }
}
