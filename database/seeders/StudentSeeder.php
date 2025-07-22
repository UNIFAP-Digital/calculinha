<?php

namespace Database\Seeders;

use App\Models\Attempt;
use App\Models\Room;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $inviteCodeToAssociate = '0311';

        $room = Room::where('invite_code', $inviteCodeToAssociate)->firstOrFail();

        $student = Student::create([
            'name'          => 'Aluno Teste',
            'username'      => 'aluno_123',
            'password'      => Hash::make('123'),
            'enrollment_id' => null,
        ]);

        Attempt::current($room, $student);
    }
}
