<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use App\Services\RoomModuleService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 1 teacher
        $teacher = User::create([
            'name'     => 'Prof. Calculinha',
            'email'    => 'professor@calculinha.com',
            'username' => 'professor_calculinha',
            'password' => Hash::make('password'),
            'role'     => Role::Teacher,
        ]);

        // Create 1 student
        $student = User::create([
            'name'     => 'Aluno Exemplo',
            'email'    => 'aluno@calculinha.com',
            'username' => 'aluno_exemplo',
            'password' => Hash::make('password'),
            'role'     => Role::Student,
        ]);

        // Create rooms using the RoomModuleService
        $roomModuleService = app(RoomModuleService::class);

        // Create a demo room with pre-test and post-test
        $room1 = $roomModuleService->createRoomWithAutoModules('Turma Exemplo 2025', $teacher);

        // Create additional rooms for testing
        $room2 = $roomModuleService->createRoomWithAutoModules('Matemática Básica', $teacher);
        $room3 = $roomModuleService->createRoomWithAutoModules('Operações Fundamentais', $teacher);

        $this->command->info('Database seeded successfully!');
        $this->command->info('Teacher: professor@calculinha.com / password');
        $this->command->info('Student: aluno@calculinha.com / password');
        $this->command->info('Room invite codes:');
        $this->command->info("- {$room1->invite_code} - {$room1->name}");
        $this->command->info("- {$room2->invite_code} - {$room2->name}");
        $this->command->info("- {$room3->invite_code} - {$room3->name}");
    }
}
