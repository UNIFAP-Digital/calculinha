<?php

namespace App\Models;

use App\Enums\OperationType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany};
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'content',
        'type',
        'operation',
        'owner_id',
    ];

    protected $casts = [
        'content'   => 'array',
        'operation' => OperationType::class,
    ];

    protected static function booted()
    {
        static::creating(function ($activity) {
            $activity->validateContent();
        });

        static::updating(function ($activity) {
            $activity->validateContent();
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'module_activity')
                    ->withPivot('position')
                    ->orderBy('module_activity.position');
    }

    public function room()
    {
        return $this->modules()->first()?->rooms()->first();
    }

    /* Factory Methods */
    public static function createMultipleChoice(
        string $question,
        array $options,
        int $correctAnswerIndex,
        OperationType $operation,
        int $ownerId
    ): self {
        if (count($options) < 2) {
            throw ValidationException::withMessages([
                'options' => 'Multiple choice questions must have at least 2 options.'
            ]);
        }

        if ($correctAnswerIndex < 0 || $correctAnswerIndex >= count($options)) {
            throw ValidationException::withMessages([
                'correct_answer_index' => 'Correct answer index must be within the options range.'
            ]);
        }

        return self::create([
            'type' => 'multiple-choice',
            'operation' => $operation,
            'content' => [
                'question' => $question,
                'options' => $options,
                'correct_answer_id' => $correctAnswerIndex,
            ],
            'owner_id' => $ownerId,
        ]);
    }

    public static function createFromTemplate(array $template, int $ownerId): self
    {
        $generated = self::generateActivityFromTemplate($template);
        
        return self::createMultipleChoice(
            $generated['question'],
            $generated['options'],
            $generated['correct_index'],
            OperationType::from($template['operation']),
            $ownerId
        );
    }

    public static function generateBatchFromTemplates(array $templates, int $ownerId, int $count = 10): array
    {
        $activities = [];
        
        foreach ($templates as $template) {
            for ($i = 0; $i < $count; $i++) {
                $activities[] = self::createFromTemplate($template, $ownerId);
            }
        }
        
        return $activities;
    }

    /* Content Helpers */
    public function getQuestion(): string
    {
        return $this->content['question'] ?? '';
    }

    public function getOptions(): array
    {
        return $this->content['options'] ?? [];
    }

    public function getCorrectAnswer(): string
    {
        $options = $this->getOptions();
        $correctIndex = $this->getCorrectAnswerIndex();
        
        return $options[$correctIndex] ?? '';
    }

    public function getCorrectAnswerIndex(): int
    {
        return $this->content['correct_answer_id'] ?? 0;
    }

    public function isMultipleChoice(): bool
    {
        return $this->type === 'multiple-choice';
    }

    public function validateContent(): void
    {
        if ($this->isMultipleChoice()) {
            if (!isset($this->content['question']) || empty($this->content['question'])) {
                throw ValidationException::withMessages([
                    'content.question' => 'Question is required for multiple choice activities.'
                ]);
            }

            if (!isset($this->content['options']) || !is_array($this->content['options'])) {
                throw ValidationException::withMessages([
                    'content.options' => 'Options array is required for multiple choice activities.'
                ]);
            }

            if (!isset($this->content['correct_answer_id']) || 
                !is_int($this->content['correct_answer_id'])) {
                throw ValidationException::withMessages([
                    'content.correct_answer_id' => 'Correct answer index is required and must be an integer.'
                ]);
            }
        }
    }

    /* Business Logic Helpers */
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
        return $this->isOwner($user) && $this->modules()->count() === 0;
    }

    public function getDifficulty(): string
    {
        $options = $this->getOptions();
        
        return match (count($options)) {
            2 => 'easy',
            3, 4 => 'medium',
            default => 'hard',
        };
    }

    /* Template Generation */
    private static function generateActivityFromTemplate(array $template): array
    {
        $operation = $template['operation'];
        $difficulty = $template['difficulty'] ?? 'medium';
        
        return match ($operation) {
            'addition' => self::generateAddition($difficulty),
            'subtraction' => self::generateSubtraction($difficulty),
            'multiplication' => self::generateMultiplication($difficulty),
            'division' => self::generateDivision($difficulty),
            default => throw new \InvalidArgumentException("Unsupported operation: {$operation}"),
        };
    }

    private static function generateAddition(string $difficulty): array
    {
        [$min, $max] = match ($difficulty) {
            'easy' => [1, 10],
            'medium' => [1, 20],
            'hard' => [10, 100],
        };

        $a = rand($min, $max);
        $b = rand($min, $max);
        $correct = $a + $b;
        
        return self::generateOptions($a, $b, $correct, '+');
    }

    private static function generateSubtraction(string $difficulty): array
    {
        [$min, $max] = match ($difficulty) {
            'easy' => [1, 10],
            'medium' => [1, 20],
            'hard' => [10, 100],
        };

        $a = rand($min, $max);
        $b = rand($min, $max);
        
        // Ensure positive result
        if ($a < $b) {
            [$a, $b] = [$b, $a];
        }
        
        $correct = $a - $b;
        
        return self::generateOptions($a, $b, $correct, '-');
    }

    private static function generateMultiplication(string $difficulty): array
    {
        [$min, $max] = match ($difficulty) {
            'easy' => [1, 5],
            'medium' => [1, 10],
            'hard' => [2, 12],
        };

        $a = rand($min, $max);
        $b = rand($min, $max);
        $correct = $a * $b;
        
        return self::generateOptions($a, $b, $correct, '×');
    }

    private static function generateDivision(string $difficulty): array
    {
        [$min, $max] = match ($difficulty) {
            'easy' => [1, 5],
            'medium' => [1, 10],
            'hard' => [2, 12],
        };

        $b = rand($min, $max);
        $correct = rand($min, $max);
        $a = $b * $correct;
        
        return self::generateOptions($a, $b, $correct, '÷');
    }

    private static function generateOptions(int $a, int $b, int $correct, string $operator): array
    {
        $options = [$correct];
        
        // Generate 3 plausible wrong answers
        while (count($options) < 4) {
            $wrong = $correct + rand(-5, 5);
            if ($wrong > 0 && $wrong !== $correct && !in_array($wrong, $options)) {
                $options[] = $wrong;
            }
        }
        
        shuffle($options);
        
        return [
            'question' => "Qual é o resultado de {$a} {$operator} {$b}?",
            'options' => $options,
            'correct_index' => array_search($correct, $options),
        ];
    }
}
