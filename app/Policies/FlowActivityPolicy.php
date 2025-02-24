<?php

namespace App\Policies;

use App\Models\FlowActivity;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FlowActivityPolicy
{
    use HandlesAuthorization;

    public function update(User $user, FlowActivity $flowActivity): bool
    {
        return $flowActivity->flow->room->owner_id === $user->id;
    }

    public function delete(User $user, FlowActivity $flowActivity): bool
    {
        return $flowActivity->flow->room->owner_id === $user->id;
    }
}
