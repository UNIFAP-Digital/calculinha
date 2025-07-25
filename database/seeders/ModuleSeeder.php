<?php

namespace Database\Seeders;

use App\Enums\Operation;
use App\Enums\Type;
use App\Models\Module;
use App\Models\ModuleActivity;
use App\Models\User;// Importar o modelo User
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {

        $professor = User::where('email', 'calculinha@gmail.com')->firstOrFail();

        $activities = [
            1  => ['position' => ModuleActivity::$initialPosition],
            3  => ['position' => ModuleActivity::$initialPosition + ModuleActivity::$positionGap],
            5  => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 2)],
            10 => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 3)],
            12 => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 4)],
            13 => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 5)],
            17 => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 6)],
            19 => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 7)],
            21 => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 8)],
            23 => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * 9)]
        ];

        Module
            ::create([
                'name'        => 'Adição',
                'description' => 'Aprenda adição de forma simples com objetos e números!',
                'operation'   => Operation::Addition,
                'type'        => Type::Exercise,
                'owner_id'    => null,
            ])
            ->activities()
            ->attach($activities);

        $activities = array_combine(
            array_map(fn($id) => $id + 24, array_keys($activities)),
            array_values($activities)
        );
        Module::create([
            'name'        => 'Subtração',
            'description' => 'Aprenda subtração de forma simples com objetos e números!',
            'operation'   => Operation::Subtraction,
            'type'        => Type::Exercise,
            'owner_id'    => null,
        ])
            ->activities()
            ->attach($activities);

        $activities = array_combine(
            array_map(fn($id) => $id + 24, array_keys($activities)),
            array_values($activities)
        );
        Module::create([
            'name'        => 'Multiplicação',
            'description' => 'Aprenda multiplicação de forma simples com objetos e números!',
            'operation'   => Operation::Multiplication,
            'type'        => Type::Exercise,
            'owner_id'    => null,
        ])
            ->activities()
            ->attach($activities);

        $activities = array_combine(
            array_map(fn($id) => $id + 24, array_keys($activities)),
            array_values($activities)
        );
        Module::create([
            'name'        => 'Divisão',
            'description' => 'Aprenda divisão de forma simples com objetos e números!',
            'operation'   => Operation::Division,
            'type'        => Type::Exercise,
            'owner_id'    => null,
        ])
            ->activities()
            ->attach($activities);
    }
}
