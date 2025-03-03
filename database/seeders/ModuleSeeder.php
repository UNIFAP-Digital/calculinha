<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\ModuleActivity;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
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
                'icon'        => '➕',
                'description' => 'Aprenda adição de forma simples com objetos e números!',
                'color'       => '#FF0000'
            ])
            ->activities()
            ->attach($activities);

        $activities = array_combine(
            array_map(fn($id) => $id + 24, array_keys($activities)),
            array_values($activities)
        );
        Module::create([
            'name'        => 'Subtração',
            'icon'        => '➖',
            'description' => 'Aprenda subtração de forma simples com objetos e números!',
            'color'       => '#00FF00'
        ])
            ->activities()
            ->attach($activities);

        $activities = array_combine(
            array_map(fn($id) => $id + 24, array_keys($activities)),
            array_values($activities)
        );
        Module::create([
            'name'        => 'Multiplicação',
            'icon'        => '✖️',
            'description' => 'Aprenda multiplicação de forma simples com objetos e números!',
            'color'       => '#0000FF'
        ])
            ->activities()
            ->attach($activities);

        $activities = array_combine(
            array_map(fn($id) => $id + 24, array_keys($activities)),
            array_values($activities)
        );
        Module::create([
            'name'        => 'Divisão',
            'icon'        => '➗',
            'description' => 'Aprenda divisão de forma simples com objetos e números!',
            'color'       => '#9B59B6'
        ])
            ->activities()
            ->attach($activities);
    }
}
