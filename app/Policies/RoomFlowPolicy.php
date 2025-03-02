<?php

namespace App\Policies;

use App\Models\RoomFlow;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RoomFlowPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {

    }

    public function view(User $user, RoomFlow $roomFlow): bool
    {
    }

    public function create(User $user): bool
    {
    }

    public function update(User $user, RoomFlow $roomFlow): bool
    {
    }

    public function delete(User $user, RoomFlow $roomFlow): bool
    {
    }

    public function restore(User $user, RoomFlow $roomFlow): bool
    {
    }

    public function forceDelete(User $user, RoomFlow $roomFlow): bool
    {
    }
}
