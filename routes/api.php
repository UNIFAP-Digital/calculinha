<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\QuizCompletionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:student')->name('api.')->group(function () {
    Route::post('/quiz/complete', [QuizCompletionController::class, 'store'])->name('quiz.complete');
});

Route::middleware('auth:sanctum')->name('api.')->group(function () {
    Route::get('/atividades', [ActivityController::class, 'index'])->name('activities.index');
    Route::get('/trilhas', [ModuleController::class, 'index'])->name('modules.index');
});
