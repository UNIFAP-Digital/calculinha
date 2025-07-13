<?php

namespace App\Policies;

use App\Models\{Module, User};

class ModulePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'teacher';
    }

    public function create(User $user): bool
    {
        return $user->role === 'teacher';
    }

    public function update(User $user, Module $module): bool
    {
        return $user->role === 'teacher' && $user->id === $module->owner_id;
    }

    public function delete(User $user, Module $module): bool
    {
        return $user->role === 'teacher' && $user->id === $module->owner_id;
    }

    public function reorderActivities(User $user, Module $module): bool
    {
        return $user->role === 'teacher' && $user->id === $module->owner_id;
    }
}