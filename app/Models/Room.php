<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Random\RandomException;

class Room extends Model
{
    protected $fillable = [
        'name',
        'invite_code',
        'is_active',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'created_at' => 'datetime',
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

    public function roomFlow(): HasMany
    {
        return $this->hasMany(RoomFlow::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }
}
