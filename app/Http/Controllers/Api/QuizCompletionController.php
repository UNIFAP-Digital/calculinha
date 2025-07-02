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
        // ALTERAÇÃO 1: A validação agora espera o ID da cópia do módulo do aluno.
        $validated = $request->validate([
            'attempt_module_id' => 'required|integer|exists:attempt_modules,id',
            'score'             => 'required|integer|min:0',
            'total_activities'  => 'required|integer|min:1',
        ]);

        /** @var Student $student */
        $student = $request->user();
        $attemptModuleId = $validated['attempt_module_id'];
        $score = $validated['score'];
        $totalActivities = $validated['total_activities'];

        return DB::transaction(function () use ($student, $attemptModuleId, $score, $totalActivities) {
            
            // ALTERAÇÃO 2: Encontra o módulo da tentativa diretamente pelo seu ID.
            $currentAttemptModule = AttemptModule::findOrFail($attemptModuleId);

            // Verificação de Segurança: Garante que o módulo pertence ao aluno logado.
            if ($currentAttemptModule->attempt->student_id !== $student->id) {
                abort(403, 'Acesso não autorizado a este módulo.');
            }
            
            $currentAttemptModule->score = $score;
            
            $passingPercentage = 40;
            $userPercentage = ($totalActivities > 0) ? ($score / $totalActivities) * 100 : 0;

            if ($userPercentage < $passingPercentage) {
                $currentAttemptModule->status = Status::Failed;
                $currentAttemptModule->save();
                return response()->json(['message' => 'Resultado registado. A pontuação não foi suficiente para avançar.'], 200);
            }
            
            $currentAttemptModule->status = Status::Passed;
            $currentAttemptModule->save();

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
