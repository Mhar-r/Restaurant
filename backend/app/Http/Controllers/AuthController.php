<?php

// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone'    => 'nullable|string|max:15',
            'role_id'  => 'required|exists:roles,id', // Por ejemplo: 1=admin, 2=cajero, 3=cliente
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
            'role_id'  => $request->role_id
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'role' => $user->role->name
            ]
        ]);
    }

    public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    $email = trim($request->email);
    $password = trim($request->password);

    $user = User::where('email', $email)->with('role')->first();

    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 401);
    }

    if (!Hash::check($password, $user->password)) {
        return response()->json(['message' => 'Contraseña incorrecta'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login exitoso',
        'token' => $token,
        'user' => [
            'id'   => $user->id,
            'name' => $user->name,
            'email'=> $user->email,
            'role_id' => $user->role_id,
            'role' => $user->role->name
        ]
    ]);
}

}
