<?php

namespace App\Policies;

use App\Models\Flow;
use App\Models\Room;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FlowPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, ?Room $room = null): bool
    {
        return !$room || $user->can('view', $room);
    }

    public function view(User $user, Flow $flow): bool
    {
        return $flow->owner_id === $user->id;
    }

    public function create(): bool
    {
        return true;
    }

    public function update(User $user, Flow $flow): bool
    {
        return $flow->owner_id === $user->id;
    }

    public function delete(User $user, Flow $flow): bool
    {
        return $flow->owner_id === $user->id;
    }
}
