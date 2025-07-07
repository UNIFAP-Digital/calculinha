<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Module[] $modules
 * @method \Illuminate\Database\Eloquent\Relations\HasMany modules()
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Activity[] $activities
 * @method \Illuminate\Database\Eloquent\Relations\HasMany activities()
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Room[] $rooms
 * @method \Illuminate\Database\Eloquent\Relations\HasMany rooms()
 */
class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
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
        ];
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'owner_id');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class, 'owner_id');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'owner_id');
    }
}
