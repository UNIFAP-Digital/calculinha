<?php

namespace Database\Factories;

use App\Enums\ActivityType;
use App\Enums\OperationType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $operation = fake()->randomElement(OperationType::cases());

        return [
            'type' => ActivityType::MultipleChoice,
            'operation' => $operation,
            'content' => $this->generateMultipleChoiceContent($operation),
        ];
    }

    /**
     * Generate multiple choice question content.
     */
    private function generateMultipleChoiceContent(OperationType $operation): array
    {
        [$num1, $num2, $correctAnswer, $question] = $this->generateQuestionData($operation);

        $options = $this->generateOptions($correctAnswer);

        return [
            'question' => $question,
            'options' => $options,
            'correct_option_index' => array_search((string)$correctAnswer, $options),
            'correct_answer' => (string)$correctAnswer,
        ];
    }

    /**
     * Generate question data based on operation.
     */
    private function generateQuestionData(OperationType $operation): array
    {
        switch ($operation) {
            case OperationType::Addition:
                $num1 = rand(1, 50);
                $num2 = rand(1, 50);
                $correctAnswer = $num1 + $num2;
                $question = "Quanto é {$num1} + {$num2}?";
                break;

            case OperationType::Subtraction:
                $num1 = rand(10, 100);
                $num2 = rand(1, $num1);
                $correctAnswer = $num1 - $num2;
                $question = "Quanto é {$num1} - {$num2}?";
                break;

            case OperationType::Multiplication:
                $num1 = rand(2, 12);
                $num2 = rand(2, 12);
                $correctAnswer = $num1 * $num2;
                $question = "Quanto é {$num1} × {$num2}?";
                break;

            case OperationType::Division:
                $num2 = rand(2, 12);
                $correctAnswer = rand(2, 12);
                $num1 = $num2 * $correctAnswer;
                $question = "Quanto é {$num1} ÷ {$num2}?";
                break;

            case OperationType::All:
                $operations = [OperationType::Addition, OperationType::Subtraction, OperationType::Multiplication, OperationType::Division];
                $randomOp = fake()->randomElement($operations);
                return $this->generateQuestionData($randomOp);

            default:
                $num1 = rand(1, 20);
                $num2 = rand(1, 20);
                $correctAnswer = $num1 + $num2;
                $question = "Quanto é {$num1} + {$num2}?";
                break;
        }

        return [$num1, $num2, $correctAnswer, $question];
    }

    /**
     * Generate multiple choice options.
     */
    private function generateOptions(int $correctAnswer): array
    {
        $options = [$correctAnswer];

        // Generate 3 wrong answers close to the correct answer
        $range = max(5, abs($correctAnswer) * 0.3);

        while (count($options) < 4) {
            $wrong = $correctAnswer + rand(-$range, $range);
            if ($wrong > 0 && $wrong !== $correctAnswer && !in_array($wrong, $options)) {
                $options[] = $wrong;
            }
        }

        shuffle($options);

        return array_map('strval', $options);
    }

    /**
     * Set the operation type.
     */
    public function operation(OperationType $operation): static
    {
        return $this->state(fn (array $attributes) => [
            'operation' => $operation,
            'content' => $this->generateMultipleChoiceContent($operation),
        ]);
    }
}
