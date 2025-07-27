<?php

namespace Database\Seeders;

use App\Enums\Operation;
use App\Enums\Type;
use App\Models\Activity;
use App\Models\Module;
use App\Models\Room;
use App\Models\RoomModule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr; // Added for Arr::mapWithKeys, though collect()->mapWithKeys is used

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a default user for the application
        $user = User::create([
            'name'     => 'Calculinha Professor',
            'email'    => 'calculinha@gmail.com',
            'password' => Hash::make('asd'), // Hashed password 'asd'
        ]);

        // Call other seeders to populate initial data like activities and modules
        $this->call([
            ActivitySeeder::class,
            ModuleSeeder::class,
        ]);

        // Copy default activities and modules for the seeded user
        $this->copyDefaultActivitiesAndModules($user);

        // Call remaining seeders
        $this->call([
            RoomSeeder::class,
            StudentSeeder::class,
        ]);
    }

    /**
     * Copy all default activities and modules (with owner_id = null) for the given user
     * This is the same logic used in RegisteredUserController
     */
    private function copyDefaultActivitiesAndModules(User $user): void
    {
        DB::transaction(function () use ($user) {
            // Get all default activities (owner_id = null)
            $defaultActivities = Activity::whereNull('owner_id')->get();

            // Create a mapping from old activity IDs to new activity IDs
            $activityIdMapping = [];

            // Copy activities
            foreach ($defaultActivities as $defaultActivity) {
                $newActivity = Activity::create([
                    'type' => $defaultActivity->type,
                    'operation' => $defaultActivity->operation,
                    'content' => $defaultActivity->content,
                    'owner_id' => $user->id,
                ]);

                $activityIdMapping[$defaultActivity->id] = $newActivity->id;
            }

            // Get all default modules (owner_id = null) with their activities
            $defaultModules = Module::whereNull('owner_id')
                ->with(['activities' => function ($query) {
                    $query->withPivot('position');
                }])
                ->get();

            // Copy modules and their activity relationships
            foreach ($defaultModules as $defaultModule) {
                $newModule = Module::create([
                    'name' => $defaultModule->name,
                    'description' => $defaultModule->description,
                    'operation' => $defaultModule->operation,
                    'type' => $defaultModule->type,
                    'owner_id' => $user->id,
                ]);

                // Copy module-activity relationships with positions
                $moduleActivities = [];
                foreach ($defaultModule->activities as $activity) {
                    if (isset($activityIdMapping[$activity->id])) {
                        $moduleActivities[$activityIdMapping[$activity->id]] = [
                            'position' => $activity->pivot->position
                        ];
                    }
                }

                if (!empty($moduleActivities)) {
                    $newModule->activities()->attach($moduleActivities);
                }
            }
        });
    }
}
