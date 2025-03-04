<?php

namespace App\Models;

use App\Enums\Operation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttemptModuleActivity extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'activity_id',
        'content',
        'answer',
        'is_correct',
        'order',
        'operation'
    ];

    protected $casts = [
        'content'    => 'array',
        'created_at' => 'datetime',
        'operation'  => Operation::class,
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(AttemptModule::class, 'attempt_module_id');
    }

    public function markAsAnswered(string $answer): void
    {
        $correctAnswer = $this->content['correct_answer'] ?? null;
        $this->answer = $answer;
        $this->is_correct = $correctAnswer !== null && $answer === $correctAnswer;
        $this->save();
    }
}
