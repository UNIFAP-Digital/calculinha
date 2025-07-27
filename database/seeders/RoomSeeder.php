<?php

namespace Database\Seeders;

use App\Enums\Operation;
use App\Enums\Type;
use App\Models\Room;
use App\Models\RoomModule;
use App\Models\User; // Assuming User model is accessible for creating modules
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // Added for DB::transaction

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // Find the user created by DatabaseSeeder or create a new one if not found
        // This is important because the modules are associated with a user.
        // For seeding, we'll assume 'calculinha@gmail.com' exists from DatabaseSeeder.
        $user = User::where('email', 'calculinha@gmail.com')->first();

        if (!$user) {
            // Fallback: Create a user if the main seeder hasn't run or email changed
            $user = User::create([
                'name'     => 'Calculinha Professor',
                'email'    => 'calculinha@gmail.com',
                'password' => \Illuminate\Support\Facades\Hash::make('asd'),
            ]);
        }

        DB::transaction(function () use ($user) {
            /** @var Room $room */
            $room = $user->rooms()->create([
                'invite_code' => '0311',
                'name'        => 'Turma 311',
            ]);

            $preTestModule = $user->modules()->create([
                'name'        => 'Pré-Teste',
                'description' => 'Avaliação prévia gerada automaticamente para a sala ' . $room->name,
                'type'        => Type::PreTest,
                'operation'   => Operation::All,
            ]);

            $postTestModule = $user->modules()->create([
                'name'        => 'Pós-Teste',
                'description' => 'Avaliação final gerada automaticamente para a sala ' . $room->name,
                'type'        => Type::PostTest,
                'operation'   => Operation::All,
            ]);

            $randomActivityIds = $user->activities()->inRandomOrder()->limit(12)->pluck('id');

            $pivotDataForTests = collect($randomActivityIds)->mapWithKeys(fn($id, $idx) => [
                $id => ['position' => RoomModule::$initialPosition + ($idx * RoomModule::$positionGap)]
            ])->all();

            $preTestModule->activities()->sync($pivotDataForTests);
            $postTestModule->activities()->sync($pivotDataForTests);

            $pivotData = [];
            $position = RoomModule::$initialPosition;
            $gap = RoomModule::$positionGap;

            $pivotData[$preTestModule->id] = ['position' => $position];
            $position += $gap;

            // Get the user's core modules (copied from defaults) by operation
            $coreModules = $user->modules()
                ->whereIn('operation', [
                    Operation::Addition,
                    Operation::Subtraction,
                    Operation::Multiplication,
                    Operation::Division
                ])
                ->where('type', Type::Exercise)
                ->orderBy('operation')
                ->get();

            foreach ($coreModules as $module) {
                $pivotData[$module->id] = ['position' => $position];
                $position += $gap;
            }

            $pivotData[$postTestModule->id] = ['position' => $position];

            $room->modules()->sync($pivotData);
        });
    }
}
