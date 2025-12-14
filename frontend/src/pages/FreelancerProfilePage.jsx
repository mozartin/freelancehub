import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getFreelancerProfile } from "../api/freelancers";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../auth/AuthContext";

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useDocumentTitle(profile?.user?.name || "Freelancer profile");

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getFreelancerProfile(id);
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load freelancer profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <PageContainer title="Freelancer profile">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Freelancer profile">
        <p className="text-sm text-red-500">{error}</p>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer title="Freelancer profile">
        <p className="text-sm text-slate-500">Profile not found.</p>
      </PageContainer>
    );
  }

  const skills =
    typeof profile.skills === "string"
      ? profile.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : profile.skills || [];

  const isOwner = user && profile.user_id === user.id;

  return (
    <PageContainer
      title={profile.user?.name || "Freelancer profile"}
      subtitle={profile.title || "Freelancer"}
    >
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/freelancers"
          className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
        >
          <span>←</span>
          <span>Back to freelancers</span>
        </Link>
        {isOwner && (
          <Link to="/profile/edit">
            <Button size="sm">Edit my profile</Button>
          </Link>
        )}
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {profile.user?.name || "No name"}
            </h2>
            {profile.title && (
              <p className="text-sm text-slate-600 mt-1">{profile.title}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
              {profile.experience_level && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 border border-indigo-100">
                  {profile.experience_level}
                </span>
              )}
              {profile.hourly_rate != null && (
                <>
                  <span>•</span>
                  <span>€{profile.hourly_rate}/h</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-700"
              >
                LinkedIn
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-700"
              >
                GitHub
              </a>
            )}
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Website
              </a>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {profile.user?.email && (
          <div className="text-sm text-slate-600">Email: {profile.user.email}</div>
        )}
      </Card>
    </PageContainer>
  );
}

