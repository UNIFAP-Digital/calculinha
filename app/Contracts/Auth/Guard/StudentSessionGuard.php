<?php

namespace App\Contracts\Auth\Guard;

use Illuminate\Auth\SessionGuard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Session\Session;
use Override;
use Symfony\Component\HttpFoundation\Request;

class StudentSessionGuard extends SessionGuard
{
    public function __construct(UserProvider $provider, Session $session, ?Request $request = null)
    {
        parent::__construct('student', $provider, $session, $request, rehashOnLogin: false);
    }

    #[Override]
    protected function hasValidCredentials($user, $credentials): bool
    {
        if (!!$user) {
            $this->fireValidatedEvent($user);
            return true;
        }

        return false;
    }
}
