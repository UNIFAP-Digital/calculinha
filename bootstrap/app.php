<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        apiPrefix: '/api/v1'
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();

        // Redireciona usuários JÁ LOGADOS que tentam acessar páginas de convidados (como /login)
        $middleware->redirectUsersTo(function () {
            if (Auth::guard('student')->check()) {
                return route('student.dashboard'); // Aluno logado vai para o dashboard dele
            }

            if (Auth::guard('web')->check()) {
                return '/salas'; // Professor logado vai para a página de salas
            }

            return '/'; // Fallback, caso necessário
        });

        // Redireciona VISITANTES que tentam acessar páginas protegidas
        $middleware->redirectGuestsTo(function (Request $request) {
            // Se a rota for de aluno, manda para o login de aluno
            if ($request->routeIs('student.*') || $request->routeIs('quiz.*')) {
                return route('student.login');
            }

            // Para todas as outras rotas protegidas, manda para o login de professor
            return route('login');
        });

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
