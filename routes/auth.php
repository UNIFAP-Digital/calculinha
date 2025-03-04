<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\InviteController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::get('convite', [InviteController::class, 'create'])->name('invite');
Route::post('convite', [InviteController::class, 'store']);

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

Route::middleware('auth:web')->put('senha', [PasswordController::class, 'update'])->name('password.update');
Route::middleware('auth')->delete('sair', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
