<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['completed', 'current']);

            $table->timestamps();
        });

        Schema::create('attempt_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('module_id')->nullable();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->integer('order');
            $table->enum('status', ['completed', 'current', 'locked']);

            $table->timestamps();

            $table->unique(['attempt_id', 'module_id']);
        });

        Schema::create('attempt_module_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_module_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('activity_id');
            $table->jsonb('content');
            $table->string('answer')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->integer('order');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['attempt_module_id', 'activity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attempts');
        Schema::dropIfExists('attempt_modules');
        Schema::dropIfExists('attempt_module_activities');
    }
};
