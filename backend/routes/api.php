<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JobController;

Route::get('/ping', fn() => response()->json(['ok' => true]));

// вакансии
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
