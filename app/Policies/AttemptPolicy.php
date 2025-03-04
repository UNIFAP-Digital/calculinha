<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttemptPolicy
{
    use HandlesAuthorization;

    public function view(User|Student $user, Room $room): bool
    {
        return $this->create($user, $room);
    }

    public function create(User|Student $user, Room $room): bool
    {
        return !!$user->rooms()->find($room);
    }
}
