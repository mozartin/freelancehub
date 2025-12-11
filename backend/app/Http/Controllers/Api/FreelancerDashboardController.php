<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Proposal;

class FreelancerDashboardController extends Controller
{
    // GET /api/dashboard/freelancer
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json([
                'message' => 'Forbidden. Only freelancers can access this endpoint.',
            ], 403);
        }

        $proposals = Proposal::query()
            ->where('freelancer_id', $user->id)
            ->with('job') // to include job info in response
            ->orderByDesc('id')
            ->paginate(10);

        return $proposals;
    }
}
