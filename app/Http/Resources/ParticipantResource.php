<?php

namespace App\Http\Resources;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Participant
 */
class ParticipantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $flowsWithActivities = $this->flowsWithActivities();
        $stats = [
            'total'   => $flowsWithActivities->sum('stats.total'),
            'correct' => $flowsWithActivities->sum('stats.correct'),
        ];

        $stats['percentage'] = $stats['total'] > 0 ? round(($stats['correct'] / $stats['total']) * 100, 2) : 0;
        $stats['ratio'] = "{$stats['correct']}/{$stats['total']}";

        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'created_at' => $this->created_at,
            'flows'      => $flowsWithActivities,
            'stats'      => $stats
        ];
    }
}
