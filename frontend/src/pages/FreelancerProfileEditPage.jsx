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

        // Guard: only freelancers can edit
        if (effectiveUser?.role !== "freelancer") {
          setError("Only freelancer accounts can edit this profile.");
          return;
        }

        // Try to fetch existing profile
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
        // If profile not found (404) — allow creating a new one
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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        <p className="text-sm text-slate-500">Loading...</p>
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
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      {success && <p className="text-sm text-emerald-600 mb-3">{success}</p>}

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Input
            label="Hourly rate (EUR)"
            name="hourly_rate"
            type="number"
            min="0"
            value={form.hourly_rate}
            onChange={handleChange}
          />
          <Input
            label="Experience level"
            name="experience_level"
            value={form.experience_level}
            onChange={handleChange}
            placeholder="Junior / Mid / Senior"
          />
          <Input
            label="Website"
            name="website_url"
            value={form.website_url}
            onChange={handleChange}
            placeholder="https://..."
          />
          <Input
            label="GitHub"
            name="github_url"
            value={form.github_url}
            onChange={handleChange}
            placeholder="https://github.com/..."
          />
          <Input
            label="LinkedIn"
            name="linkedin_url"
            value={form.linkedin_url}
            onChange={handleChange}
            placeholder="https://www.linkedin.com/in/..."
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
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

