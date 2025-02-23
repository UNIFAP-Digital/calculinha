<?php

namespace App\Policies;

use App\Models\Flow;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FlowPolicy
{
    use HandlesAuthorization;

    public function viewAny(): bool
    {
        return true;
    }

    public function view(User $user, Flow $flow): bool
    {
        return $flow->room->user->id === $user->id;
    }

    public function create(): bool
    {
        return true;
    }

    public function update(User $user, Flow $flow): bool
    {
        return $flow->room->user->id === $user->id;
    }

    public function delete(User $user, Flow $flow): bool
    {
        return $flow->room->user->id === $user->id;
    }
}
