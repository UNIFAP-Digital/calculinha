<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomModule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ActivitySeeder::class,
            ModuleSeeder::class,
        ]);

        $user = User::create([
            'name'     => 'Calculinha Professor',
            'email'    => 'calculinha@gmail.com',
            'password' => Hash::make('asd'),
        ]);

        /** @var Room $room */
        $room = $user->rooms()->create([
            'invite_code' => '0311',
            'name'        => 'Turma 311',
        ]);

        $room->modules()->attach([
            1 => ['position' => RoomModule::$initialPosition],
            2 => ['position' => RoomModule::$initialPosition + (RoomModule::$positionGap * 2)],
            3 => ['position' => RoomModule::$initialPosition + (RoomModule::$positionGap * 3)],
            4 => ['position' => RoomModule::$initialPosition + (RoomModule::$positionGap * 4)]
        ]);
    }
}
