<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\InviteController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\StudentLoginController;
use Illuminate\Support\Facades\Route;

//================================================
// ROTAS DE AUTENTICAÇÃO DO PROFESSOR (GUARD: WEB)
//================================================
Route::middleware('guest:web')->group(function () {
    Route::get('cadastrar', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('cadastrar', [RegisteredUserController::class, 'store']);

    Route::get('entrar', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('entrar', [AuthenticatedSessionController::class, 'store']);

    Route::get('esqueceu-a-senha', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('esqueceu-a-senha', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('redefinir-a-senha/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('redefinir-a-senha', [NewPasswordController::class, 'store'])->name('password.store');
});

Route::middleware('auth:web')->group(function () {
    Route::put('senha', [PasswordController::class, 'update'])->name('password.update');
    Route::post('sair', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});


//=================================================
// ROTAS DE AUTENTICAÇÃO DO ALUNO (GUARD: STUDENT)
//=================================================

Route::prefix('student')->name('student.')->group(function () {
    Route::middleware('guest:student')->group(function () {
        Route::get('/register', [InviteController::class, 'create'])->name('register');
        Route::post('/register', [InviteController::class, 'store'])->name('register.store');

        Route::get('/login', [StudentLoginController::class, 'create'])->name('login');
        Route::post('/login', [StudentLoginController::class, 'store'])->name('login.store');
    });

    Route::middleware('auth:student')->group(function () {
        Route::post('/logout', [StudentLoginController::class, 'destroy'])->name('logout');
    });
});
