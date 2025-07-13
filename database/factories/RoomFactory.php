<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true) . ' Class',
            'invite_code' => str_pad((string)rand(1, 9999), 4, '0', STR_PAD_LEFT),
            'owner_id' => User::factory()->teacher(),
            'is_active' => true,
        ];
    }
}
