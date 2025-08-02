<?php

namespace App\Http\Controllers\Api;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\AttemptModule;
use App\Models\AttemptModuleActivity;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class QuizCompletionController extends Controller
{
    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws ValidationException
     * @throws Throwable
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'attempt_module_id' => 'required|integer|exists:attempt_modules,id',
            'answers'           => 'required|array',
            'answers.*.id' =>   'required|integer',
            'answers.*.isCorrect' => 'required|boolean', 
        ]);

        /** @var Student $student */
        $student = $request->user();
        $attemptModuleId = $validated['attempt_module_id'];
        $answers = $validated['answers'];

        return DB::transaction(function () use ($student, $attemptModuleId, $answers) {
            
            $currentAttemptModule = AttemptModule::with('attempt')->findOrFail($attemptModuleId);

            if ($currentAttemptModule->attempt->student_id !== $student->id) {
                abort(403, 'Acesso não autorizado a este módulo.');
            }
            foreach ($answers as $answer) {
                AttemptModuleActivity::where('id', $answer['id'])
                    ->where('attempt_module_id', $currentAttemptModule->id) 
                    ->update(['is_correct' => $answer['isCorrect']]);
            }

            $score = collect($answers)->where('isCorrect', true)->count();

            $currentAttemptModule->status = Status::Passed;
            $currentAttemptModule->score = $score;
            $currentAttemptModule->save();

            $attempt = $currentAttemptModule->attempt;
            $nextAttemptModule = $currentAttemptModule->nextModule();

            if ($nextAttemptModule) {
                if ($nextAttemptModule->status === Status::Locked) {
                    $nextAttemptModule->status = Status::Current;
                    $nextAttemptModule->save();
                }
            } else {
                $attempt->status = Status::Completed;
                $attempt->save();
            }
            
            return response()->json(['message' => 'Quiz concluído e progresso atualizado!'], 200);

        });
    }
}
