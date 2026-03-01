import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import {
  getFreelancerProfileByUser,
  updateFreelancerProfile,
  createFreelancerProfile,
} from "../api/freelancers";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../auth/AuthContext";
import { meRequest } from "../api/auth";

export default function FreelancerProfileEditPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentUser, setCurrentUser] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    skills: "",
    hourly_rate: "",
    experience_level: "",
    website_url: "",
    github_url: "",
    linkedin_url: "",
  });

  useDocumentTitle("Edit freelancer profile");

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        let effectiveUser = user;
        if (!user) {
          effectiveUser = await meRequest();
          setCurrentUser(effectiveUser);
        }

        if (effectiveUser?.role !== "freelancer") {
          setError("Only freelancer accounts can edit this profile.");
          return;
        }

        const profile = await getFreelancerProfileByUser(effectiveUser.id);
        setProfileId(profile.id);
        setForm({
          title: profile.title || "",
          skills: profile.skills || "",
          hourly_rate: profile.hourly_rate ?? "",
          experience_level: profile.experience_level || "",
          website_url: profile.website_url || "",
          github_url: profile.github_url || "",
          linkedin_url: profile.linkedin_url || "",
        });
      } catch (err) {
        console.warn("Profile fetch failed, will allow create", err);
        setProfileId(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentUser?.id) {
      setError("Missing user context. Please log in again.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title || null,
        skills: form.skills || null,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        experience_level: form.experience_level || null,
        website_url: form.website_url || null,
        github_url: form.github_url || null,
        linkedin_url: form.linkedin_url || null,
      };

      let profile;
      if (profileId) {
        profile = await updateFreelancerProfile(profileId, payload);
      } else {
        profile = await createFreelancerProfile({
          user_id: currentUser.id,
          ...payload,
        });
        setProfileId(profile.id);
      }

      setSuccess("Profile saved.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Edit freelancer profile">
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
          <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </PageContainer>
    );
  }

  if (error && !currentUser) {
    return (
      <PageContainer title="Edit freelancer profile">
        <p className="text-sm text-red-500">{error}</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Edit freelancer profile"
      subtitle="Update how clients see your freelancer profile."
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 max-w-2xl">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 max-w-2xl">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Developer"
          />
          <Textarea
            label="Skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Tailwind"
            helperText="Comma-separated list."
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hourly rate (EUR)"
              name="hourly_rate"
              type="number"
              min="0"
              value={form.hourly_rate}
              onChange={handleChange}
              placeholder="e.g. 45"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 tracking-tight">
                Experience level
              </label>
              <select
                name="experience_level"
                value={form.experience_level}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white hover:border-slate-300"
              >
                <option value="">Select level</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
              Links
            </h3>
            <div className="space-y-4">
              <Input
                label="Website"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="yoursite.com"
                helperText="https:// will be added automatically if missing."
              />
              <Input
                label="GitHub"
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
                placeholder="github.com/username"
                helperText="https:// will be added automatically if missing."
              />
              <Input
                label="LinkedIn"
                name="linkedin_url"
                value={form.linkedin_url}
                onChange={handleChange}
                placeholder="linkedin.com/in/username"
                helperText="https:// will be added automatically if missing."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
