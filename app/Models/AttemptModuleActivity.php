<?php

namespace App\Models;

use App\Enums\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttemptModuleActivity extends Model
{
    protected $table = 'attempt_module_activities';

    public $timestamps = false;

    protected $fillable = [
        'attempt_module_id',
        'activity_id',
        'operation',
        'type',
        'answer',
        'is_correct',
        'position',
        'content'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'content'    => 'array',
        'operation'  => Operation::class,
        'created_at' => 'datetime'
    ];

    public function attemptModule(): BelongsTo
    {
        return $this->belongsTo(AttemptModule::class);
    }

    /**
     * Get the original Activity, including soft-deleted ones.
     */
    public function originalActivity(): BelongsTo
    {
        return $this->belongsTo(Activity::class, 'activity_id')->withTrashed();
    }

    public function markAsAnswered(string $answer): void
    {
        $correctAnswer = $this->content['correct_answer'] ?? null;
        $this->answer = $answer;
        $this->is_correct = $correctAnswer !== null && $answer === $correctAnswer;
        $this->save();
    }
}
