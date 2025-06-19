<?php

namespace App\Http\Controllers\Api;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Room;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class QuizCompletionController extends Controller
{
    /**
     * Store a completed quiz attempt and advance the student to the next module if they passed.
     * Aligns with the Attempt -> AttemptModule structure.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws ValidationException
     * @throws Throwable
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|integer|exists:rooms,id',
            'module_id' => 'required|integer|exists:modules,id',
            'score' => 'required|integer|min:0',
            'total_activities' => 'required|integer|min:1',
        ]);

        /** @var Student $student */
        $student = $request->user();
        $roomId = $validated['room_id'];
        $moduleId = $validated['module_id'];
        $score = $validated['score'];
        $totalActivities = $validated['total_activities'];

        $room = Room::findOrFail($roomId);

        return DB::transaction(function () use ($student, $room, $moduleId, $score, $totalActivities) {
            
            $attempt = Attempt::current($room, $student);
            $currentAttemptModule = $attempt->modules()->where('module_id', $moduleId)->first();

            if (!$currentAttemptModule) {
                return response()->json(['message' => 'Módulo não encontrado para esta tentativa.'], 404);
            }

            // Guarda a pontuação primeiro.
            $currentAttemptModule->score = $score;
            
            $passingPercentage = 40;
            $userPercentage = ($totalActivities > 0) ? ($score / $totalActivities) * 100 : 0;

            // Lógica atualizada para definir o estado como Aprovado (Passed) ou Reprovado (Failed)
            if ($userPercentage < $passingPercentage) {
                // O aluno não passou
                $currentAttemptModule->status = Status::Failed;
                $currentAttemptModule->save();
                return response()->json(['message' => 'Resultado registado. A pontuação não foi suficiente para avançar.'], 200);
            }
            
            // O aluno passou
            $currentAttemptModule->status = Status::Passed;
            $currentAttemptModule->save();

            // Como o aluno passou, desbloqueia o próximo módulo
            $nextAttemptModule = $currentAttemptModule->nextModule();

            if ($nextAttemptModule) {
                if ($nextAttemptModule->status === Status::Locked) {
                    $nextAttemptModule->status = Status::Current;
                    $nextAttemptModule->save();
                }
            } else {
                // Se não há próximo módulo, a trilha está completa
                $attempt->status = Status::Completed;
                $attempt->save();
            }

            return response()->json(['message' => 'Quiz concluído e progresso atualizado!'], 200);
        });
    }
}
