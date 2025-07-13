<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attempt extends Model
{
    protected $fillable = [
        'student_id',
        'room_id',
        'number',
        'answers',
        'score',
        'time_spent',
        'current_activity_id',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'answers'      => 'array',
        'started_at'   => 'datetime',
        'finished_at'  => 'datetime',
    ];

    /* -------------------------------------------------
     |  Relations
     * -------------------------------------------------*/
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
    public function currentActivity(): BelongsTo
    {
        return $this->belongsTo(Activity::class, 'current_activity_id');
    }

    /* -------------------------------------------------
     |  Helpers
     * -------------------------------------------------*/
    public function markAnswer(Activity $activity, bool $correct, int $ms): void
    {
        $answers = $this->answers ?? [];
        $answers[$activity->id] = ['correct' => $correct, 'time' => $ms];
        $this->answers = $answers;

        $this->score      = collect($answers)->where('correct', true)->count();
        $this->time_spent = collect($answers)->sum('time');
    }

    public function advance(Activity $next = null): void
    {
        $this->current_activity_id = $next?->id;
        if ($next === null) {
            $this->finished_at = now();
        }
        $this->save();
    }

    public function isCompleted(): bool
    {
        return $this->finished_at !== null;
    }

    /* -------------------------------------------------
     |  Static constructors
     * -------------------------------------------------*/
    public static function start(User $student, Room $room): self
    {
        return static::create([
            'student_id' => $student->id,
            'room_id'    => $room->id,
            'number'     => static::where('student_id', $student->id)
                                   ->where('room_id', $room->id)
                                   ->max('number') + 1,
            'current_activity_id' => $room->modules()
                                          ->with('activities')
                                          ->first()
                                          ?->activities
                                          ->first()
                                          ?->id,
        ]);
    }

    public static function current(User $student, Room $room): ?self
    {
        return static::where('student_id', $student->id)
                     ->where('room_id', $room->id)
                     ->whereNull('finished_at')
                     ->latest()
                     ->first();
    }
}
