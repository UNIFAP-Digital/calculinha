<?php

use App\Enums\Status;
use App\Models\Student;
use App\Models\AttemptModule;
use App\Models\AttemptModuleActivity;
use App\Models\Attempt;
use App\Models\Room;
use App\Models\User;

test('quiz completion saves the calculated score', function () {
    // Create a student user
    $student = Student::factory()->create();
    
    // Create a room and attempt
    $room = Room::factory()->create();
    $attempt = Attempt::factory()->create([
        'student_id' => $student->id,
        'room_id' => $room->id,
        'status' => Status::Current
    ]);
    
    // Create an attempt module
    $attemptModule = AttemptModule::factory()->create([
        'attempt_id' => $attempt->id,
        'status' => Status::Current,
        'score' => null // Initially no score
    ]);
    
    // Create some activities with answers
    AttemptModuleActivity::factory()->create([
        'attempt_module_id' => $attemptModule->id,
        'is_correct' => true,
        'position' => 1
    ]);
    
    AttemptModuleActivity::factory()->create([
        'attempt_module_id' => $attemptModule->id,
        'is_correct' => false,
        'position' => 2
    ]);
    
    AttemptModuleActivity::factory()->create([
        'attempt_module_id' => $attemptModule->id,
        'is_correct' => true,
        'position' => 3
    ]);
    
    // Make the API call to complete the quiz
    $response = $this->actingAs($student, 'student')
        ->postJson('/api/quiz/complete', [
            'attempt_module_id' => $attemptModule->id,
        ]);
    
    // Assert the response is successful
    $response->assertStatus(200);
    $response->assertJson(['message' => 'Quiz concluído e progresso atualizado!']);
    
    // Refresh the attempt module and check that the score was saved
    $attemptModule->refresh();
    
    // Should have 2 correct answers out of 3 total
    expect($attemptModule->score)->toBe(2);
    expect($attemptModule->status)->toBe(Status::Passed);
});

test('quiz completion calculates score correctly with all correct answers', function () {
    // Create a student user
    $student = Student::factory()->create();
    
    // Create a room and attempt
    $room = Room::factory()->create();
    $attempt = Attempt::factory()->create([
        'student_id' => $student->id,
        'room_id' => $room->id,
        'status' => Status::Current
    ]);
    
    // Create an attempt module
    $attemptModule = AttemptModule::factory()->create([
        'attempt_id' => $attempt->id,
        'status' => Status::Current,
        'score' => null
    ]);
    
    // Create activities with all correct answers
    AttemptModuleActivity::factory()->create([
        'attempt_module_id' => $attemptModule->id,
        'is_correct' => true,
        'position' => 1
    ]);
    
    AttemptModuleActivity::factory()->create([
        'attempt_module_id' => $attemptModule->id,
        'is_correct' => true,
        'position' => 2
    ]);
    
    // Make the API call
    $response = $this->actingAs($student, 'student')
        ->postJson('/api/quiz/complete', [
            'attempt_module_id' => $attemptModule->id,
        ]);
    
    $response->assertStatus(200);
    
    // Check score is 2 (all correct)
    $attemptModule->refresh();
    expect($attemptModule->score)->toBe(2);
});

test('quiz completion calculates score correctly with no correct answers', function () {
    // Create a student user
    $student = Student::factory()->create();
    
    // Create a room and attempt
    $room = Room::factory()->create();
    $attempt = Attempt::factory()->create([
        'student_id' => $student->id,
        'room_id' => $room->id,
        'status' => Status::Current
    ]);
    
    // Create an attempt module
    $attemptModule = AttemptModule::factory()->create([
        'attempt_id' => $attempt->id,
        'status' => Status::Current,
        'score' => null
    ]);
    
    // Create activities with all wrong answers
    AttemptModuleActivity::factory()->create([
        'attempt_module_id' => $attemptModule->id,
        'is_correct' => false,
        'position' => 1
    ]);
    
    AttemptModuleActivity::factory()->create([
        'attempt_module_id' => $attemptModule->id,
        'is_correct' => false,
        'position' => 2
    ]);
    
    // Make the API call
    $response = $this->actingAs($student, 'student')
        ->postJson('/api/quiz/complete', [
            'attempt_module_id' => $attemptModule->id,
        ]);
    
    $response->assertStatus(200);
    
    // Check score is 0 (no correct answers)
    $attemptModule->refresh();
    expect($attemptModule->score)->toBe(0);
});
