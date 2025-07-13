<?php

namespace App\Providers;

use App\Policies\{RoomPolicy, ModulePolicy, ActivityPolicy};
use App\Models\{Room, Module, Activity, User};
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
    Room::class     => RoomPolicy::class,
    Module::class   => ModulePolicy::class,
    Activity::class => ActivityPolicy::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('student-only', fn (User $user) => $user->role === 'student');
        Gate::define('teacher-only', fn (User $user) => $user->role === 'teacher');
    }


}
