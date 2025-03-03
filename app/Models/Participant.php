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
//            ->using(ModuleActivity::class)
//            ->withPivot('position')
//            ->orderByPivot('position');
//    }
//
    public function moduleActivities(): BelongsToMany
    {
        return $this->belongsToMany(ModuleActivity::class, 'attempts')
            ->withPivot(['is_correct', 'answer', 'created_at']);
    }

    public function modulesWithActivities(): Collection
    {
        $modulesMap = collect();

        if ($this->moduleActivities) {
            $groupedModuleActivities = $this->moduleActivities->groupBy('module_id');

            foreach ($groupedModuleActivities as $moduleId => $moduleActivities) {
                $moduleData = $moduleActivities->first()->module;

                $modulesMap->push([
                    'id'              => $moduleData->id,
                    'name'            => $moduleData->name,
                    'icon'            => $moduleData->icon,
                    'color'           => $moduleData->color,
                    'position'        => $moduleData->position,
                    'module_activities' => $moduleActivities->map(function ($moduleActivity) {
                        return [
                            'id'          => $moduleActivity->id,
                            'module_id'     => $moduleActivity->module_id,
                            'activity_id' => $moduleActivity->activity_id,
                            'position'    => $moduleActivity->position,
                            'activity'    => [
                                'id'       => $moduleActivity->activity->id,
                                'question' => $moduleActivity->activity->content['question']
                            ],

                            'attempt' => [
                                'answer'     => $moduleActivity->pivot->answer,
                                'is_correct' => $moduleActivity->pivot->is_correct,
                                'created_at' => $moduleActivity->pivot->created_at,
                            ]
                        ];
                    })->sortBy('position')->values(),

                    'stats' => $moduleActivities
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

        return $modulesMap->sortBy('position')->values();
    }
}
