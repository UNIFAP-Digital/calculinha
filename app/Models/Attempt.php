<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attempt extends Model
{
    protected $fillable = [
        'participant_id',
        'flow_activity_id',
        'answer',
        'is_correct',
    ];

    public function flowActivity(): BelongsTo
    {
        return $this->belongsTo(FlowActivity::class);
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
