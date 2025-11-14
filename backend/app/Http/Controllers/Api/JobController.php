<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // GET /api/jobs?q=react
    public function index(Request $request)
    {
        $q = Job::query()->latest();

        if ($search = $request->query('q')) {
            $q->where(function ($qq) use ($search) {
                $qq->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('skills', 'like', "%{$search}%");
            });
        }

        return $q->paginate(10);
    }

    // GET /api/jobs/{id}
    public function show($id)
    {
        return Job::findOrFail($id);
    }

    // POST /api/jobs
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'skills' => 'nullable|string|max:255',
            'budget_type' => 'required|in:fixed,hourly',
            'budget_min' => 'nullable|integer|min:0',
            'budget_max' => 'nullable|integer|min:0',
            'status' => 'required|in:open,in_progress,closed',
        ]);

        $job = Job::create($data);

        return response()->json($job, 201);
    }

    // PUT /api/jobs/{id}
    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'skills' => 'nullable|string|max:255',
            'budget_type' => 'required|in:fixed,hourly',
            'budget_min' => 'nullable|integer|min:0',
            'budget_max' => 'nullable|integer|min:0',
            'status' => 'required|in:open,in_progress,closed',
        ]);

        $job->update($data);

        return response()->json($job);
    }

    // DELETE /api/jobs/{id}
    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }
}
