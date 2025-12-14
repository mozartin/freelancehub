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

    // GET /api/freelancer-profiles/user/{userId}
    public function showByUser($userId)
    {
        // Ensure the user exists
        $user = User::findOrFail($userId);

        $profile = FreelancerProfile::with('user')
            ->where('user_id', $userId)
            ->first();

        if (!$profile) {
            $profile = FreelancerProfile::create([
                'user_id' => $user->id,
                'title' => null,
                'skills' => null,
                'hourly_rate' => null,
                'experience_level' => null,
                'website_url' => null,
                'github_url' => null,
                'linkedin_url' => null,
            ])->load('user');
        }

        return $profile;
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

        // Prefer authenticated user id if available to avoid spoofing
        $userId = $request->user()?->id ?? $data['user_id'];

        // Upsert single profile per user_id
        $profile = FreelancerProfile::firstOrNew(['user_id' => $userId]);
        $profile->fill([
            'title' => $data['title'] ?? null,
            'skills' => $data['skills'] ?? null,
            'hourly_rate' => $data['hourly_rate'] ?? null,
            'experience_level' => $data['experience_level'] ?? null,
            'website_url' => $data['website_url'] ?? null,
            'github_url' => $data['github_url'] ?? null,
            'linkedin_url' => $data['linkedin_url'] ?? null,
        ]);
        $profile->user_id = $userId;
        $profile->save();

        return response()->json($profile->load('user'), $profile->wasRecentlyCreated ? 201 : 200);
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
