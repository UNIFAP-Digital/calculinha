<?php

namespace Database\Factories;

use App\Enums\ModuleType;
use App\Enums\OperationType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Module>
 */
class ModuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'operation' => fake()->randomElement(OperationType::cases()),
            'type' => ModuleType::Regular,
            'no_feedback' => false,
            'color' => fake()->hexColor(),
            'icon' => fake()->randomElement(['📊', '🎯', '📝', '🔢']),
            'owner_id' => User::factory()->teacher(),
        ];
    }

    /**
     * Set the operation type.
     */
    public function operation(OperationType $operation): static
    {
        return $this->state(fn (array $attributes) => [
            'operation' => $operation,
        ]);
    }

    /**
     * Set as pre-test module.
     */
    public function preTest(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Pré-teste',
            'description' => 'Avaliação inicial com 12 questões aleatórias',
            'type' => ModuleType::PreTest,
            'operation' => OperationType::All,
            'no_feedback' => true,
            'color' => '#FF6B6B',
            'icon' => '📝',
        ]);
    }

    /**
     * Set as post-test module.
     */
    public function postTest(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Pós-teste',
            'description' => 'Avaliação final com 12 questões aleatórias',
            'type' => ModuleType::PostTest,
            'operation' => OperationType::All,
            'no_feedback' => true,
            'color' => '#4ECDC4',
            'icon' => '🎯',
        ]);
    }
}
