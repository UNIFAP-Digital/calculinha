<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Student extends Authenticatable
{
    protected $primaryKey = 'enrollment_id';

    protected $fillable = [
        'name',
        'enrollment_id',
    ];

    protected $hidden = [
        'enrollment_id'
    ];

    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function rooms(): HasManyThrough
    {
        return $this->hasManyThrough(
            Room::class,
            Attempt::class,
            'student_id',
            'id',
            'id',
            'room_id'
        );
    }
}
