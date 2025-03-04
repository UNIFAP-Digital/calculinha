<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AttemptController;
use App\Http\Controllers\Api\ModuleController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->name('api.')->group(function () {
    Route::post('/resultado', [AttemptController::class, 'store'])->name('quiz.store');
});

Route::middleware('auth:sanctum')->name('api.')->group(function () {
    Route::get('/atividades', [ActivityController::class, 'index'])->name('activities.index');
    Route::get('/trilhas', [ModuleController::class, 'index'])->name('modules.index');
});
