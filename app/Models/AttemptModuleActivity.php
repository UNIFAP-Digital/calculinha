<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
