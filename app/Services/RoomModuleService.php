<?php

namespace App\Services;

use App\Enums\{ActivityType, ModuleType, OperationType};
use App\Models\{Activity, Module, Room, User};
use Illuminate\Support\Collection;

class RoomModuleService
{
    public function createPreTestModule(User $owner): Module
    {
        $module = Module::create([
            'name' => 'Pré-teste',
            'description' => 'Avaliação inicial com 12 questões aleatórias (3 de cada operação matemática)',
            'type' => ModuleType::PreTest,
            'operation' => OperationType::All,
            'no_feedback' => true,
            'owner_id' => $owner->id,
            'color' => '#FF6B6B',
            'icon' => '📝',
        ]);

        $this->generateActivitiesForModule($module, 12);

        return $module;
    }

    public function createPostTestModule(User $owner): Module
    {
        $module = Module::create([
            'name' => 'Pós-teste',
            'description' => 'Avaliação final com 12 questões aleatórias (3 de cada operação matemática)',
            'type' => ModuleType::PostTest,
            'operation' => OperationType::All,
            'no_feedback' => true,
            'owner_id' => $owner->id,
            'color' => '#4ECDC4',
            'icon' => '🎯',
        ]);

        $this->generateActivitiesForModule($module, 12);

        return $module;
    }

    private function generateActivitiesForModule(Module $module, int $count): void
    {
        $operations = [
            OperationType::Addition,
            OperationType::Subtraction,
            OperationType::Multiplication,
            OperationType::Division,
        ];

        $activitiesPerOperation = intdiv($count, count($operations));
        $activities = collect();

        foreach ($operations as $operation) {
            for ($i = 0; $i < $activitiesPerOperation; $i++) {
                $activities->push($this->createActivity($operation, $module->owner_id));
            }
        }

        // Attach activities to module with positions
        $module->activities()->sync(
            $activities->mapWithKeys(fn ($activity, $index) => [$activity->id => ['position' => $index + 1]])
        );
    }

    private function createActivity(OperationType $operation, int $ownerId): Activity
    {
        $questionData = $this->generateMultipleChoiceQuestion($operation);

        return Activity::create([
            'content' => $questionData,
            'type' => ActivityType::MultipleChoice,
            'operation' => $operation,
            'owner_id' => $ownerId,
        ]);
    }

    private function generateMultipleChoiceQuestion(OperationType $operation): array
    {
        [$num1, $num2, $correctAnswer, $question] = $this->generateQuestionData($operation);

        $options = $this->generateOptions($correctAnswer, $operation);

        return [
            'question' => $question,
            'options' => $options,
            'correct_option_index' => array_search($correctAnswer, $options),
            'correct_answer' => (string) $correctAnswer,
        ];
    }

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

            default:
                throw new \InvalidArgumentException("Invalid operation: {$operation->value}");
        }

        return [$num1, $num2, $correctAnswer, $question];
    }

    private function generateOptions(int $correctAnswer, OperationType $operation): array
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

    public function createRoomWithAutoModules(string $name, User $owner): Room
    {
        return \DB::transaction(function () use ($name, $owner) {
            $room = Room::create([
                'name' => $name,
                'owner_id' => $owner->id,
            ]);

            $preTest = $this->createPreTestModule($owner);
            $postTest = $this->createPostTestModule($owner);

            // Attach modules in order: pre-test, regular modules, post-test
            $room->modules()->sync([
                $preTest->id => ['position' => 1],
                $postTest->id => ['position' => 2], // Will be updated to last position
            ]);

            return $room->load('modules.activities');
        });
    }
}
