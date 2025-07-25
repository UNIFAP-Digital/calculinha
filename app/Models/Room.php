<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Random\RandomException;

class Room extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'invite_code',
        'owner_id',
        'is_active'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    /**
     * @throws RandomException
     */
    public static function generateValidInviteCode(): string
    {
        do {
            $code = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
            $exists = Room::where('invite_code', $code)->exists();
        } while ($exists);

        return $code;
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function modules(): BelongsToMany
    {
        return $this
            ->belongsToMany(Module::class, 'room_module')
            ->using(RoomModule::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function students(): HasManyThrough
    {
        return $this->hasManyThrough(
            Student::class,
            Attempt::class,
            'room_id',
            'id',
            'id',
            'student_id'
        );
    }
}
