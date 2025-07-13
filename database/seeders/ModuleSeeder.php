<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\User;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
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

        // Create some regular modules for testing
        \App\Models\Module::factory()->count(5)->create([
            'owner_id' => $teacher->id,
            'type' => \App\Enums\ModuleType::Regular,
        ]);

        // Create pre-test and post-test modules
        \App\Models\Module::factory()->preTest()->create([
            'owner_id' => $teacher->id,
        ]);

        \App\Models\Module::factory()->postTest()->create([
            'owner_id' => $teacher->id,
        ]);
    }
}
