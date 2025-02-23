<?php

namespace Database\Seeders;

use App\Models\Activity;
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
            'name' => 'Turma 311',
        ]);

        $flow = $room->flows()->create([
            'name'        => 'Adição',
            'icon'        => '➕',
            'description' => 'Aprenda a somar dois números!',
            'color'       => '#32a852',
            'order'       => 1,
        ]);

        $flow->activities()->attach(1, ['order' => 1]);
        $flow->activities()->attach(2, ['order' => 2]);
        $flow->activities()->attach(3, ['order' => 3]);
        $flow->activities()->attach(4, ['order' => 4]);
        $flow->activities()->attach(5, ['order' => 5]);
        $flow->activities()->attach(6, ['order' => 6]);
        $flow->activities()->attach(7, ['order' => 7]);
        $flow->activities()->attach(8, ['order' => 8]);
        $flow->activities()->attach(9, ['order' => 9]);
        $flow->activities()->attach(10, ['order' => 10]);
    }

    public function createSystemActivities(): void
    {
        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 🍎🍎🍎 + 🍎🍎',
                'correct_answer' => '🍎🍎🍎🍎🍎',
                'choices'        => [
                    '🍎🍎🍎🍎',
                    '🍎🍎🍏🍎🍎',
                    '🍎🍎🍎',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 🍓🍓 + 🍓🍓',
                'correct_answer' => '🍓🍓🍓🍓',
                'choices'        => [
                    '🍓🍓🍓🍓🍓',
                    '🍓🍓',
                    '🍓🍓🍓',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 🍉 + 🍉🍉🍉',
                'correct_answer' => '🍉🍉🍉🍉',
                'choices'        => [
                    '🍉🍉',
                    '🍉🍉🍉🍉🍉',
                    '🍉🍉🍉',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 1 melância + 🍉🍉🍉',
                'correct_answer' => '4 melâncias',
                'choices'        => [
                    '🍉🍉',
                    '1 melância',
                    '🍉🍉🍉',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 2 morangos + 🍓🍓🍓',
                'correct_answer' => '🍓🍓🍓🍓🍓',
                'choices'        => [
                    '🍓🍓🍓',
                    '2 morangos',
                    '🍓🍓🍓🍓',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 🍎 + 4 maçãs',
                'correct_answer' => '5 maçãs',
                'choices'        => [
                    '🍎',
                    '6 maçãs',
                    '🍎🍎',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 1 + 4',
                'correct_answer' => '5',
                'choices'        => [
                    '6',
                    '2',
                    '3',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 3 + 7 maçãs',
                'correct_answer' => '10',
                'choices'        => [
                    '9',
                    '11',
                    '7',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 6 + 2 maçãs',
                'correct_answer' => '8',
                'choices'        => [
                    '4',
                    '5',
                    '7',
                ]
            ]
        ]);

        Activity::create([
            'content' => [
                'type'           => 'multiple-choice',
                'question'       => 'Quanto é 3 + 4 maçãs',
                'correct_answer' => '7',
                'choices'        => [
                    '3',
                    '4',
                    '8',
                ]
            ]
        ]);
    }
}
