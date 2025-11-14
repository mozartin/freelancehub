<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JobController;

Route::get('/ping', fn() => response()->json(['ok' => true]));

// Job CRUD
Route::get('/jobs', [JobController::class, 'index']);      // list
Route::get('/jobs/{id}', [JobController::class, 'show']);  // detail
Route::post('/jobs', [JobController::class, 'store']);     // create
Route::put('/jobs/{id}', [JobController::class, 'update']); // full update
Route::delete('/jobs/{id}', [JobController::class, 'destroy']); // delete