<?php

namespace App\Providers;

use App\Contracts\Auth\Guard\StudentSessionGuard;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Session\SessionManager;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Auth::extend('student-session', function (Application $app, $name, array $config) {
            $provider = Auth::createUserProvider($config['provider']);
            $session = $app->make(SessionManager::class)->driver();
            $request = $app->make('request');
            return new StudentSessionGuard($provider, $session, $request);
        });
        JsonResource::withoutWrapping();
        Vite::prefetch(concurrency: 3);
    }
}
