<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;

class ClientDashboardController extends Controller
{
    // GET /api/dashboard/client
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json([
                'message' => 'Forbidden. Only clients can access this endpoint.',
            ], 403);
        }

        $jobs = Job::query()
            ->where('client_id', $user->id)
            ->withCount('proposals') // adds proposals_count field
            ->orderByDesc('id')
            ->paginate(10);

        return $jobs;
    }
}
