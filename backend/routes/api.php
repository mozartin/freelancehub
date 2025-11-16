<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\FreelancerProfileController;
use App\Http\Controllers\Api\ProposalController;

Route::get('/ping', fn() => response()->json(['ok' => true]));

// Users CRUD
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Jobs CRUD 
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::post('/jobs', [JobController::class, 'store']);
Route::put('/jobs/{id}', [JobController::class, 'update']);
Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

// FreelancerProfiles CRUD 
Route::get('/freelancer-profiles', [FreelancerProfileController::class, 'index']);
Route::get('/freelancer-profiles/{id}', [FreelancerProfileController::class, 'show']);
Route::post('/freelancer-profiles', [FreelancerProfileController::class, 'store']);
Route::put('/freelancer-profiles/{id}', [FreelancerProfileController::class, 'update']);
Route::delete('/freelancer-profiles/{id}', [FreelancerProfileController::class, 'destroy']);


// Proposals for job
Route::get('/jobs/{job}/proposals', [ProposalController::class, 'indexByJob']);
Route::post('/jobs/{job}/proposals', [ProposalController::class, 'storeForJob']);

// Single proposal
Route::get('/proposals/{id}', [ProposalController::class, 'show']);
Route::put('/proposals/{id}', [ProposalController::class, 'update']);
Route::delete('/proposals/{id}', [ProposalController::class, 'destroy']);