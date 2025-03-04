<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Module;
use App\Models\ModuleActivity;
use Illuminate\Support\Facades\Gate;

class ModuleActivityController extends Controller
{

    const DEFAULT_POSITION_GAP = 100.0;

    /**
     * Reposiciona uma atividade dentro de um módulo
     */
    public function reposition(Request $request, Module $module, Activity $activity)
    {
        Gate::authorize('update', [ModuleActivity::class, $module, $activity]);

        $request->validate([
            'position' => 'required|integer|min:0',
        ]);

        $newPosition = (int) $request->position;

        // Encontra a atividade no módulo
        $moduleActivity = $module->activities()->find($activity->id);
        if (!$moduleActivity) {
            return response()->json(['message' => 'Atividade não encontrada neste módulo'], 404);
        }

        // Buscar todas as atividades ordenadas pela posição atual
        $activities = $module->activities()
            ->orderBy('module_activity.position', 'asc')
            ->get();

        // Se não houver mudança de posição, retornamos cedo
        $currentIndex = $activities->search(function ($item) use ($activity) {
            return $item->id === $activity->id;
        });

        if ($currentIndex === $newPosition) {
            return response()->json(['message' => 'Posição não alterada'], 200);
        }

        // Calculamos as posições baseadas em gaps
        $repositionedActivities = $this->calculateNewPositions($activities, $activity->id, $newPosition);

        // Atualizamos as posições no banco de dados em uma única transação
        DB::transaction(function () use ($module, $repositionedActivities) {
            foreach ($repositionedActivities as $activityId => $newPosition) {
                $module->activities()->updateExistingPivot($activityId, [
                    'position' => $newPosition
                ]);
            }
        });

        return response()->json([
            'message' => 'Atividade reposicionada com sucesso',
            'positions' => $repositionedActivities
        ]);
    }

    /**
     * Calcula novas posições para todas as atividades afetadas pela reordenação
     */
    private function calculateNewPositions($activities, $movingActivityId, $newPosition)
    {
        $totalItems = $activities->count();
        $result = [];

        // Se não houver atividades anteriores, iniciamos com posições em gaps padrão
        if ($totalItems === 0) {
            return [$movingActivityId => static::DEFAULT_POSITION_GAP];
        }

        // Determina o índice atual da atividade a ser movida
        $currentIndex = $activities->search(function ($item) use ($movingActivityId) {
            return $item->id === $movingActivityId;
        });

        // Garantimos que newPosition está dentro dos limites
        $newPosition = max(0, min($totalItems - 1, $newPosition));

        // Se a atividade estiver se movendo para a mesma posição, não fazemos nada
        if ($currentIndex === $newPosition) {
            return [];
        }

        // Remove a atividade da lista para podermos recalcular
        $movingActivity = $activities[$currentIndex];
        $activities->forget($currentIndex);

        // Reinsere a atividade na nova posição
        $beforeInsert = $activities->slice(0, $newPosition);
        $afterInsert = $activities->slice($newPosition);

        $reordered = $beforeInsert->push($movingActivity)->concat($afterInsert);

        // Agora vamos calcular as novas posições
        // Para evitar muitas atualizações, só recalculamos posições se:
        // 1. O item está se movendo para a primeira ou última posição
        // 2. Não há espaço suficiente entre itens na nova posição

        if ($newPosition === 0) {
            // Movendo para a primeira posição
            $nextPosition = $reordered[1]->pivot->position ?? static::DEFAULT_POSITION_GAP * 2;
            $result[$movingActivityId] = $nextPosition / 2;
        } else if ($newPosition === $totalItems - 1) {
            // Movendo para a última posição
            $prevPosition = $reordered[$totalItems - 2]->pivot->position;
            $result[$movingActivityId] = $prevPosition + static::DEFAULT_POSITION_GAP;
        } else {
            // Movendo para uma posição intermediária
            $prevPosition = $reordered[$newPosition - 1]->pivot->position;
            $nextPosition = $reordered[$newPosition + 1]->pivot->position;

            $gap = $nextPosition - $prevPosition;

            if ($gap < 1.0) {
                // Espaço insuficiente, precisamos reordenar tudo
                return $this->recalculateAllPositions($reordered);
            }

            // Posiciona no meio do intervalo
            $result[$movingActivityId] = $prevPosition + ($gap / 2);
        }

        return $result;
    }

    /**
     * Recalcula todas as posições com intervalos iguais
     */
    private function recalculateAllPositions($activities)
    {
        $totalItems = $activities->count();
        $result = [];

        foreach ($activities as $index => $activity) {
            $position = ($index + 1) * static::DEFAULT_POSITION_GAP;
            $result[$activity->id] = $position;
        }

        return $result;
    }


    /**
     * Métodos antigos mantidos para compatibilidade
     */

    public function moveUp(Module $module, Activity $activity)
    {
        Gate::authorize('update', [ModuleActivity::class, $module, $activity]);

        $activity = $module->activities()->find($activity->id);
        $activity->pivot->moveUp();

        return back();
    }

    public function moveDown(Module $module, Activity $activity)
    {
        Gate::authorize('update', [ModuleActivity::class, $module, $activity]);

        $activity = $module->activities()->find($activity->id);
        $activity->pivot->moveDown();

        return back();
    }
}
