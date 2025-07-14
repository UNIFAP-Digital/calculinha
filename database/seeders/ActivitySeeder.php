<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teacher = User::where('role', \App\Enums\Role::Teacher)->first();

        if (!$teacher) {
            $teacher = User::factory()->teacher()->create();
        }

        // Create activities for testing
        Activity::factory()->count(50)->create([
            'owner_id' => $teacher->id,
        ]);
    }
}
