<?php

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'enrollment_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'role'              => Role::class,
        ];
    }

    /* -------------------------------------------------
     |  Scopes
     * -------------------------------------------------*/
    public function scopeStudents($query)
    {
        return $query->where('role', Role::Student);
    }
    public function scopeTeachers($query)
    {
        return $query->where('role', Role::Teacher);
    }

    /* -------------------------------------------------
     |  Accessors / Mutators
     * -------------------------------------------------*/
    protected function isStudent(): Attribute
    {
        return Attribute::get(fn () => $this->role === Role::Student);
    }

    protected function isTeacher(): Attribute
    {
        return Attribute::get(fn () => $this->role === Role::Teacher);
    }

    /* -------------------------------------------------
     |  Relations
     * -------------------------------------------------*/
    // Teacher
    public function ownedRooms(): HasMany
    {
        return $this->hasMany(Room::class, 'owner_id');
    }
    public function ownedModules(): HasMany
    {
        return $this->hasMany(Module::class, 'owner_id');
    }
    public function ownedActivities(): HasMany
    {
        return $this->hasMany(Activity::class, 'owner_id');
    }

    // Student
    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class, 'student_id');
    }
    public function roomsViaAttempts(): HasManyThrough
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
