<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany};
use Illuminate\Database\Eloquent\SoftDeletes;
use Random\RandomException;

class Room extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'invite_code',
        'owner_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /* -------------------------------------------------
     |  Boot
     * -------------------------------------------------*/
    protected static function booted(): void
    {
        static::creating(fn (Room $room) => $room->invite_code ??= static::generateInviteCode());
    }

    /* -------------------------------------------------
     |  Relations
     * -------------------------------------------------*/
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'room_module')
                    ->withPivot('position')
                    ->orderBy('room_module.position');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'attempts.room_id')
                    ->distinct();
    }

    /* -------------------------------------------------
     |  Helpers
     * -------------------------------------------------*/
    public function activitiesOrdered(): \Illuminate\Support\Collection
    {
        return $this->modules()
                    ->with('activities')
                    ->get()
                    ->flatMap(
                        fn (Module $m) =>
                        $m->activities->map->setRelation('module', $m)
                    );
    }

    /**
     * @throws RandomException
     */
    private static function generateInviteCode(): string
    {
        do {
            $code = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (static::where('invite_code', $code)->exists());

        return $code;
    }
}
