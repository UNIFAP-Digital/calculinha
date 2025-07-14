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

        $templates = [
            ['operation' => 'addition', 'difficulty' => 'medium'],
            ['operation' => 'subtraction', 'difficulty' => 'medium'],
            ['operation' => 'multiplication', 'difficulty' => 'medium'],
            ['operation' => 'division', 'difficulty' => 'medium'],
        ];
        
        $module->generateActivitiesFromTemplates($templates, 3);

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

        $templates = [
            ['operation' => 'addition', 'difficulty' => 'medium'],
            ['operation' => 'subtraction', 'difficulty' => 'medium'],
            ['operation' => 'multiplication', 'difficulty' => 'medium'],
            ['operation' => 'division', 'difficulty' => 'medium'],
        ];
        
        $module->generateActivitiesFromTemplates($templates, 3);

        return $module;
    }

    public function createOperationModule(User $owner, OperationType $operation, string $name, string $description): Module
    {
        $color = match($operation) {
            OperationType::Addition => '#4CAF50',
            OperationType::Subtraction => '#FF9800',
            OperationType::Multiplication => '#2196F3',
            OperationType::Division => '#9C27B0',
        };

        $icon = match($operation) {
            OperationType::Addition => '➕',
            OperationType::Subtraction => '➖',
            OperationType::Multiplication => '✖️',
            OperationType::Division => '➗',
        };

        $module = Module::create([
            'name' => $name,
            'description' => $description,
            'type' => ModuleType::Regular,
            'operation' => $operation,
            'no_feedback' => false,
            'owner_id' => $owner->id,
            'color' => $color,
            'icon' => $icon,
        ]);

        $template = [['operation' => $operation->value, 'difficulty' => 'medium']];
        $module->generateActivitiesFromTemplates($template, 10);

        return $module;
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

    public function createRoomWithSixModules(string $name, User $owner, string $inviteCode = null): Room
    {
        return \DB::transaction(function () use ($name, $owner, $inviteCode) {
            $room = Room::create([
                'name' => $name,
                'owner_id' => $owner->id,
                'invite_code' => $inviteCode,
            ]);

            // Create all 6 modules
            $preTest = $this->createPreTestModule($owner);
            $additionModule = $this->createOperationModule($owner, OperationType::Addition, 'Adição', 'Módulo de adição com 10 questões');
            $subtractionModule = $this->createOperationModule($owner, OperationType::Subtraction, 'Subtração', 'Módulo de subtração com 10 questões');
            $multiplicationModule = $this->createOperationModule($owner, OperationType::Multiplication, 'Multiplicação', 'Módulo de multiplicação com 10 questões');
            $divisionModule = $this->createOperationModule($owner, OperationType::Division, 'Divisão', 'Módulo de divisão com 10 questões');
            $postTest = $this->createPostTestModule($owner);

            // Attach modules in order with positions
            $room->modules()->sync([
                $preTest->id => ['position' => 1],
                $additionModule->id => ['position' => 2],
                $subtractionModule->id => ['position' => 3],
                $multiplicationModule->id => ['position' => 4],
                $divisionModule->id => ['position' => 5],
                $postTest->id => ['position' => 6],
            ]);

            return $room->load('modules.activities');
        });
    }
}
