<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ModuleActivityController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\AttemptController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomModuleController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome');

Route
    ::controller(AttemptController::class)
    ->middleware('room.access')
    ->name('quiz.')
    ->prefix('/salas/{room}/quiz')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{module}', 'show')->name('show');
    });

Route::middleware('auth')->group(function () {
    Route::controller(ActivityController::class)->prefix('/atividades')->group(function () {
        Route::get('/', 'index')->name('activities.index');
        Route::post('/', 'store')->name('activities.store');
        Route::put('/{activity}', 'update')->name('activities.update');
        Route::delete('/{activity}', 'destroy')->name('activities.destroy');
    });

    Route
        ::controller(ModuleController::class)
        ->name('modules.')
        ->prefix('/trilhas')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/adicionar', 'create')->name('create');
            Route::get('/{module}/editar', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{module}', 'update')->name('update');
            Route::delete('/{module}', 'destroy')->name('destroy');

            Route
                ::controller(ModuleActivityController::class)
                ->name('activities.')
                ->prefix('/{module}/atividades')
                ->group(function () {
                    Route::post('/{activity}/move-up', 'moveUp')->name('move-up');
                    Route::post('/{activity}/move-down', 'moveDown')->name('move-down');
                });
        });

    Route
        ::controller(RoomController::class)
        ->name('rooms.')
        ->prefix('/salas')
        ->group(function () {
            Route::get('/adicionar', 'create')->name('create');
            Route::get('/{room?}', 'index')->name('index');
            Route::get('/{room}/editar', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{room}', 'update')->name('update');
            Route::delete('/{room}', 'destroy')->name('destroy');

            Route
                ::controller(RoomModuleController::class)
                ->prefix('/{room}/trilhas')
                ->name('modules.')
                ->group(function () {
                    Route::post('/{module}/move-up', 'moveUp')->name('move-up');
                    Route::post('/{module}/move-down', 'moveDown')->name('move-down');
                });
        });
})->scopeBindings();

require __DIR__ . '/auth.php';
