<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreelancerProfile;
use App\Models\User;
use Illuminate\Http\Request;

class FreelancerProfileController extends Controller
{
    // GET /api/freelancer-profiles
    public function index()
    {
        return FreelancerProfile::with('user')
            ->orderByDesc('id')
            ->paginate(10);
    }

    // GET /api/freelancer-profiles/{id}
    public function show($id)
    {
        return FreelancerProfile::with('user')->findOrFail($id);
    }

    // POST /api/freelancer-profiles
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'nullable|string|max:255',
            'skills' => 'nullable|string|max:255',
            'hourly_rate' => 'nullable|integer|min:0',
            'experience_level' => 'nullable|string|max:50',
            'website_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
        ]);

        // (optional) check that user is a freelancer
        // $user = User::findOrFail($data['user_id']);
        // if ($user->role !== 'freelancer') { ... }

        $profile = FreelancerProfile::create($data);

        return response()->json($profile->load('user'), 201);
    }

    // PUT /api/freelancer-profiles/{id}
    public function update(Request $request, $id)
    {
        $profile = FreelancerProfile::findOrFail($id);

        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'skills' => 'nullable|string|max:255',
            'hourly_rate' => 'nullable|integer|min:0',
            'experience_level' => 'nullable|string|max:50',
            'website_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
        ]);

        $profile->update($data);

        return response()->json($profile->load('user'));
    }

    // DELETE /api/freelancer-profiles/{id}
    public function destroy($id)
    {
        $profile = FreelancerProfile::findOrFail($id);
        $profile->delete();

        return response()->json(['message' => 'Freelancer profile deleted']);
    }
}
