<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flow extends Model
{
    protected $fillable = [
        'room_id',
        'name',
        'icon',
        'description',
        'color',
        'position'
    ];

    public function flowActivities(): HasMany
    {
        return $this->hasMany(FlowActivity::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function roomFlows(): HasMany
    {
        return $this->hasMany(RoomFlow::class);
    }
}
