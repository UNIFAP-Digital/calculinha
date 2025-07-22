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
            RoomSeeder::class,
            StudentSeeder::class,
        ]);

    }
}
