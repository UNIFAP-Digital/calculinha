<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;

class RegisterUserController extends Controller
{
    public function student(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role'     => 'student',
        ]);

        event(new Registered($user));
        auth()->login($user);

        return response()->json(['user' => $user], 201);
    }

    public function teacher(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role'     => 'teacher',
        ]);

        event(new Registered($user));
        auth()->login($user);

        return response()->json(['user' => $user], 201);
    }
}
