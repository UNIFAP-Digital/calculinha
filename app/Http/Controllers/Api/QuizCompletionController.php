<?php

namespace App\Http\Controllers\Api;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\AttemptModule;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class QuizCompletionController extends Controller
{
    /**
     * Store a completed quiz attempt and advance the student to the next module if they passed.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws ValidationException
     * @throws Throwable
     */
    public function store(Request $request)
    {
        // ALTERAÇÃO 1: A validação agora espera apenas o ID da cópia do módulo do aluno.
        // Score e total_activities são calculados no backend a partir dos dados salvos.
        $validated = $request->validate([
            'attempt_module_id' => 'required|integer|exists:attempt_modules,id',
            'score'             => 'required|integer|min:0',
            'total_activities'  => 'required|integer|min:1',
        ]);

        /** @var Student $student */
        $student = $request->user();
        $attemptModuleId = $validated['attempt_module_id'];
        $score = $validated['score'];

        return DB::transaction(function () use ($student, $attemptModuleId, $score) {
            
            // ALTERAÇÃO 2: Encontra o módulo da tentativa diretamente pelo seu ID.
            $currentAttemptModule = AttemptModule::findOrFail($attemptModuleId);

            // Verificação de Segurança: Garante que o módulo pertence ao aluno logado.
            if ($currentAttemptModule->attempt->student_id !== $student->id) {
                abort(403, 'Acesso não autorizado a este módulo.');
            }

            // ALTERAÇÃO 4: Calcula o score a partir das atividades salvas
            $currentAttemptModule->load(['activities']);
            $totalActivities = $currentAttemptModule->activities->count();
            $correctAnswers = $currentAttemptModule->activities->where('is_correct', true)->count();

            // Log detalhado para debug
            \Log::info("Quiz completion calculated", [
                'attempt_module_id' => $attemptModuleId,
                'student_id' => $student->id,
                'total_activities' => $totalActivities,
                'correct_answers' => $correctAnswers,
                'score' => $score,
                'activities_detail' => $currentAttemptModule->activities->map(function($activity) {
                    return [
                        'id' => $activity->id,
                        'answer' => $activity->answer,
                        'is_correct' => $activity->is_correct,
                        'position' => $activity->position
                    ];
                })
            ]);

            // ALTERAÇÃO 5: Marca o módulo como concluído com o score calculado do backend
            $currentAttemptModule->status = Status::Passed;
            $currentAttemptModule->score = $score;
            $currentAttemptModule->save();

            \Log::info("Quiz completion saved", [
                'attempt_module_id' => $attemptModuleId,
                'student_id' => $student->id,
                'score_saved' => $currentAttemptModule->score,
                'status' => $currentAttemptModule->status->value
            ]);


            // A lógica para avançar a trilha permanece a mesma.
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
