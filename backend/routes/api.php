<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\FreelancerProfileController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientDashboardController;
use App\Http\Controllers\Api\FreelancerDashboardController;

Route::get('/ping', fn() => response()->json(['ok' => true]));

// Users CRUD (скорее всего, эти позже тоже спрячем за auth, но пока оставим как есть)
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Jobs — публичные только GET
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);

// FreelancerProfiles CRUD 
Route::get('/freelancer-profiles', [FreelancerProfileController::class, 'index']);
Route::get('/freelancer-profiles/{id}', [FreelancerProfileController::class, 'show']);
Route::post('/freelancer-profiles', [FreelancerProfileController::class, 'store']);
Route::put('/freelancer-profiles/{id}', [FreelancerProfileController::class, 'update']);
Route::delete('/freelancer-profiles/{id}', [FreelancerProfileController::class, 'destroy']);

// Proposals for job
Route::get('/jobs/{job}/proposals', [ProposalController::class, 'indexByJob']);

// Single proposal
Route::get('/proposals/{id}', [ProposalController::class, 'show']);
Route::put('/proposals/{id}', [ProposalController::class, 'update']);
Route::delete('/proposals/{id}', [ProposalController::class, 'destroy']);

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
   // текущий пользователь
   Route::get('/me', [AuthController::class, 'me']);
   Route::post('/logout', [AuthController::class, 'logout']);

   // 👉 СОЗДАНИЕ/ИЗМЕНЕНИЕ/УДАЛЕНИЕ JOBS — ТОЛЬКО ДЛЯ ЗАЛОГИНЕННЫХ
   Route::post('/jobs', [JobController::class, 'store']);
   Route::put('/jobs/{id}', [JobController::class, 'update']);
   Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

   // dashboards
   Route::get('/dashboard/client', [ClientDashboardController::class, 'index']);
   Route::get('/dashboard/freelancer', [FreelancerDashboardController::class, 'index']);


   // proposals
   Route::post('/jobs/{job}/proposals', [ProposalController::class, 'storeForJob']);
});

// Dev route — смена роли
Route::patch('/dev/users/{id}/role', function ($id) {
   $user = \App\Models\User::findOrFail($id);

   $user->role = 'freelancer';
   $user->save();

   return [
      'status' => 'ok',
      'message' => 'User role updated to freelancer',
      'user' => $user
   ];
});
