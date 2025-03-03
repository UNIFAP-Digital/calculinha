<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\ModuleActivity;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->createSystemActivities();

        $user = User::create([
            'name'     => 'Calculinha XD',
            'email'    => 'calculinha@gmail.com',
            'password' => Hash::make('asd'),
        ]);

        $room = $user->rooms()->create([
            'invite_code' => '0311',
            'name'        => 'Turma 311',
        ]);

        $module = $user->modules()->create([
            'name'        => 'Adição',
            'icon'        => '➕',
            'description' => 'Aprendendo adição com dois números!',
            'color'       => '#32a852'
        ]);

        Activity::all()->reduce(function (int $position, Activity $activity) use ($module) {
            $module->activities()->attach($activity->id, ['position' => $position]);

            return $position + ModuleActivity::$positionGap;
        }, ModuleActivity::$initialPosition);
    }

    public function createSystemActivities(): void
    {
        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 🍎🍎🍎 + 🍎🍎?',
                'correct_answer' => '🍎🍎🍎🍎🍎',
                'wrong_answers'  => [
                    '🍎🍎🍎🍎',
                    '🍎🍎🍏🍎🍎',
                    '🍎🍎🍎',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 🍓🍓 + 🍓🍓?',
                'correct_answer' => '🍓🍓🍓🍓',
                'wrong_answers'  => [
                    '🍓🍓🍓🍓🍓',
                    '🍓🍓',
                    '🍓🍓🍓',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 🍉 + 🍉🍉🍉?',
                'correct_answer' => '🍉🍉🍉🍉',
                'wrong_answers'  => [
                    '🍉🍉',
                    '🍉🍉🍉🍉🍉',
                    '🍉🍉🍉',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 1 melância + 🍉🍉🍉?',
                'correct_answer' => '4 melâncias',
                'wrong_answers'  => [
                    '🍉🍉',
                    '1 melância',
                    '🍉🍉🍉',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 2 morangos + 🍓🍓🍓?',
                'correct_answer' => '🍓🍓🍓🍓🍓',
                'wrong_answers'  => [
                    '🍓🍓🍓',
                    '2 morangos',
                    '🍓🍓🍓🍓',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 🍎 + 4 maçãs?',
                'correct_answer' => '5 maçãs',
                'wrong_answers'  => [
                    '🍎',
                    '6 maçãs',
                    '🍎🍎',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 1 + 4?',
                'correct_answer' => '5',
                'wrong_answers'  => [
                    '6',
                    '2',
                    '3',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 3 + 7 maçãs?',
                'correct_answer' => '10',
                'wrong_answers'  => [
                    '9',
                    '11',
                    '7',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 6 + 2 maçãs?',
                'correct_answer' => '8',
                'wrong_answers'  => [
                    '4',
                    '5',
                    '7',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple_choice',
                'question'       => 'Quanto é 3 + 4 maçãs?',
                'correct_answer' => '7',
                'wrong_answers'  => [
                    '3',
                    '4',
                    '8',
                ]
            ]
        ]);
    }
}
