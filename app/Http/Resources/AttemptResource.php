<?php

namespace App\Http\Resources;

use App\Models\Attempt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Attempt
 */
class AttemptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id'         => $this->id,
            'status'     => $this->status,
            'created_at' => $this->created_at->toIso8601ZuluString(),
            'updated_at' => $this->updated_at->toIso8601ZuluString(),
        ];

        if ($this->relationLoaded('modules')) {
            $moduleCollection = ModuleResource::collection($this->whenLoaded('modules'));

            $data['modules'] = $moduleCollection;

            $totalHits = 0;
            $totalMistakes = 0;
            $totalActivities = 0;

            foreach ($this->modules as $module) {
                if ($module->relationLoaded('activities')) {
                    $hits = $module->activities->where('is_correct', true)->whereNotNull('is_correct')->count();
                    $mistakes = $module->activities->where('is_correct', false)->whereNotNull('is_correct')->count();
                    $total = $module->activities->count();

                    $totalHits += $hits;
                    $totalMistakes += $mistakes;
                    $totalActivities += $total;
                }
            }

            $data['total_stats'] = [
                'hits'     => $totalHits,
                'mistakes' => $totalMistakes,
                'total'    => $totalActivities,
                'hit_rate' => $totalActivities > 0 ? round(($totalHits / $totalActivities) * 100, 2) : 0,
            ];
        }

        return $data;
    }
}
