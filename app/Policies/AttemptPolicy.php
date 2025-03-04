<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttemptPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Student $student, Room $room): bool
    {
        return $this->create($user, $student, $room);
    }

    public function createY(User $user, Student $student, Room $room): bool
    {
        return $student->rooms()->find($room);
    }
}
