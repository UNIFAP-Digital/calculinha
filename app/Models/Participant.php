<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

class Participant extends Model
{
    protected $fillable = [
        'name',
        'room_id',
    ];

//    public function attempts(): BelongsToMany
//    {
//        return $this
//            ->belongsToMany(Activity::class)
//            ->using(FlowActivity::class)
//            ->withPivot('position')
//            ->orderByPivot('position');
//    }
//
    public function flowActivities(): BelongsToMany
    {
        return $this->belongsToMany(FlowActivity::class, 'attempts')
            ->withPivot(['is_correct', 'answer', 'created_at']);
    }

    public function flowsWithActivities(): Collection
    {
        $flowsMap = collect();

        if ($this->flowActivities) {
            $groupedFlowActivities = $this->flowActivities->groupBy('flow_id');

            foreach ($groupedFlowActivities as $flowId => $flowActivities) {
                $flowData = $flowActivities->first()->flow;

                $flowsMap->push([
                    'id'              => $flowData->id,
                    'name'            => $flowData->name,
                    'icon'            => $flowData->icon,
                    'color'           => $flowData->color,
                    'position'        => $flowData->position,
                    'flow_activities' => $flowActivities->map(function ($flowActivity) {
                        return [
                            'id'          => $flowActivity->id,
                            'flow_id'     => $flowActivity->flow_id,
                            'activity_id' => $flowActivity->activity_id,
                            'position'    => $flowActivity->position,
                            'activity'    => [
                                'id'       => $flowActivity->activity->id,
                                'question' => $flowActivity->activity->content['question']
                            ],

                            'attempt' => [
                                'answer'     => $flowActivity->pivot->answer,
                                'is_correct' => $flowActivity->pivot->is_correct,
                                'created_at' => $flowActivity->pivot->created_at,
                            ]
                        ];
                    })->sortBy('position')->values(),

                    'stats' => $flowActivities
                        ->pipe(function ($attempts) {
                            $total = $attempts->count();
                            $correct = $attempts->where('pivot.is_correct', true)->count();

                            return [
                                'total'      => $total,
                                'correct'    => $correct,
                                'percentage' => $total > 0 ? round(($correct / $total) * 100, 2) : 0,
                                'ratio'      => "$correct/$total"
                            ];
                        })
                ]);
            }
        }

        return $flowsMap->sortBy('position')->values();
    }
}
