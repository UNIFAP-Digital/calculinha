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
            $table->foreignId('room_id')->constrained()->onDelete('restrict');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['completed', 'current', 'passed', 'failed']); 
            $table->integer('number');

            $table->timestamps();
        });

        Schema::create('attempt_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('module_id')->nullable();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->integer('order');
            $table->enum('status', ['completed', 'current', 'locked', 'passed', 'failed']); // Adicionado os novos status
            
            // CORREÇÃO: Adicionada a coluna 'score' que estava a causar o erro.
            $table->integer('score')->nullable()->after('status');
            
            $table->enum('operation', ['addition', 'subtraction', 'multiplication', 'division', 'all'])->nullable();
            $table->enum('type', ['pre-test', 'exercise','post-test']);

            $table->timestamps();

            $table->unique(['attempt_id', 'order']);
        });

        Schema::create('attempt_module_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_module_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('activity_id')->nullable();

            $table->enum('operation', ['addition', 'subtraction', 'multiplication', 'division', 'all', ]);
            $table->string('type');
            $table->string('answer')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->integer('order');
            $table->jsonb('content');

            $table->timestamp('created_at')->useCurrent();

            $table->unique(['attempt_module_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attempt_module_activities');
        Schema::dropIfExists('attempt_modules');
        Schema::dropIfExists('attempts');
    }
};
