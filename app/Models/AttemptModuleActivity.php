<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttemptModuleActivity extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'activity_id',
        'content',
        'answer',
        'is_correct',
        'order'
    ];

    protected $casts = [
        'content'    => 'array',
        'created_at' => 'datetime',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(AttemptModule::class, 'attempt_module_id');
    }
}
