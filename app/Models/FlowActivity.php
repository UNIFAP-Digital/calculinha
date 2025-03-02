<?php

namespace App\Models;

use App\Models\Abstracts\PositionablePivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FlowActivity extends PositionablePivot
{
    public $incrementing = true;
    public $timestamps   = false;

    protected $fillable = [
        'flow_id',
        'activity_id',
        'position',
    ];

    protected $casts = [
        'position' => 'integer'
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function flow(): BelongsTo
    {
        return $this->belongsTo(Flow::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'attempts')
            ->withPivot(['is_correct', 'answer', 'created_at']);
    }

    public function getPositionGroupColumn(): string
    {
        return 'flow_id';
    }
}
