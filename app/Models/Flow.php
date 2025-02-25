<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flow extends PositionableModel
{
    protected $fillable = [
        'room_id',
        'name',
        'icon',
        'description',
        'color',
        'position'
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function flowActivities(): HasMany
    {
        return $this->hasMany(FlowActivity::class);
    }

    public function getPositionGroupColumn(): string
    {
        return 'room_id';
    }
}
