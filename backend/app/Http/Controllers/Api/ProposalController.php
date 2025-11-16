<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
use App\Models\Job;
use Illuminate\Http\Request;

class ProposalController extends Controller
{
    // GET /api/jobs/{job}/proposals
    public function indexByJob($jobId)
    {
        $job = Job::findOrFail($jobId);

        return $job->proposals()
            ->with('freelancer')
            ->orderByDesc('id')
            ->paginate(10);
    }

    // POST /api/jobs/{job}/proposals
    public function storeForJob(Request $request, $jobId)
    {
        $job = Job::findOrFail($jobId);

        $data = $request->validate([
            'freelancer_id' => 'required|exists:users,id',
            'cover_letter' => 'required|string',
            'proposed_budget' => 'nullable|integer|min:0',
            'estimated_days' => 'nullable|integer|min:1',
            'status' => 'nullable|in:sent,accepted,rejected',
        ]);

        $data['job_id'] = $job->id;
        $data['status'] = $data['status'] ?? 'sent';

        $proposal = Proposal::create($data);

        return response()->json($proposal->load('job', 'freelancer'), 201);
    }

    // GET /api/proposals/{id}
    public function show($id)
    {
        return Proposal::with('job', 'freelancer')->findOrFail($id);
    }

    // PUT /api/proposals/{id}
    public function update(Request $request, $id)
    {
        $proposal = Proposal::findOrFail($id);

        $data = $request->validate([
            'cover_letter' => 'sometimes|required|string',
            'proposed_budget' => 'nullable|integer|min:0',
            'estimated_days' => 'nullable|integer|min:1',
            'status' => 'nullable|in:sent,accepted,rejected',
        ]);

        $proposal->update($data);

        return response()->json($proposal->load('job', 'freelancer'));
    }

    // DELETE /api/proposals/{id}
    public function destroy($id)
    {
        $proposal = Proposal::findOrFail($id);
        $proposal->delete();

        return response()->json(['message' => 'Proposal deleted']);
    }
}
