import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getFreelancerProfileByUser } from "../api/freelancers";
import { meRequest } from "../api/auth";

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [currentUser, setCurrentUser] = useState(user || null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");

  const effectiveUser = user || currentUser;
  const isClient = effectiveUser?.role === "client";
  const isFreelancer = effectiveUser?.role === "freelancer";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated) {
          setItems([]);
          setProfile(null);
          setLoading(false);
          return;
        }

        let activeUser = effectiveUser;
        if (!activeUser) {
          try {
            activeUser = await meRequest();
            setCurrentUser(activeUser);
          } catch (e) {
            console.error("Failed to load current user", e);
            setItems([]);
            setProfile(null);
            setLoading(false);
            return;
          }
        }

        let url = "";
        if (activeUser.role === "client") {
          url = "/dashboard/client";
          setProfile(null);
        } else if (activeUser.role === "freelancer") {
          url = "/dashboard/freelancer";
        } else {
          setItems([]);
          return;
        }

        if (activeUser.role === "freelancer") {
          const [proposalsRes, profileResOrError] = await Promise.allSettled([
            api.get(url),
            getFreelancerProfileByUser(activeUser.id),
          ]);

          if (proposalsRes.status === "fulfilled") {
            const proposalsData = proposalsRes.value.data.data ?? proposalsRes.value.data;
            setItems(proposalsData || []);
          } else {
            setItems([]);
          }

          if (profileResOrError.status === "fulfilled" && profileResOrError.value) {
            setProfile(profileResOrError.value);
            setProfileError("");
          } else if (profileResOrError.status === "rejected" && profileResOrError.reason?.response?.status === 404) {
            setProfile(null);
            setProfileError("");
          } else if (profileResOrError.status === "rejected") {
            console.error(profileResOrError.reason);
            setProfile(null);
            setProfileError("Could not load your freelancer profile.");
          }
        } else {
          const res = await api.get(url);
          const data = res.data.data ?? res.data;
          setItems(data);
        }
      } catch (err) {
        console.error(err);
        if (effectiveUser?.role === "freelancer") {
          setProfileError("Could not load your freelancer profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, effectiveUser?.id, effectiveUser?.role]);

  const handleLogout = () => {
    logout();
  };

  const title = isClient
    ? "Client dashboard"
    : isFreelancer
    ? "Freelancer dashboard"
    : "Dashboard";

  const subtitle = isClient
    ? "Manage your posted jobs and track incoming proposals."
    : isFreelancer
    ? "Review your proposals and keep track of opportunities."
    : "Overview of your account.";

  useDocumentTitle(title);

  return (
    <PageContainer title={title} subtitle={subtitle}>
      {/* User info bar */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/20">
            {(effectiveUser?.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {effectiveUser?.name || "User"}
            </div>
            <div className="text-xs text-slate-500">
              {effectiveUser?.role === "client" ? "💼 Client" : "🚀 Freelancer"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isFreelancer && (
            <Link to="/profile/edit">
              <Button variant="outline" size="sm">
                Edit profile
              </Button>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
          <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading dashboard...
        </div>
      ) : (
        <div className="space-y-5">
          {isClient && <ClientDashboardList jobs={items} />}
          {isFreelancer && (
            <>
              <FreelancerProfileSummary profile={profile} error={profileError} />
              <FreelancerDashboardList proposals={items} />
            </>
          )}

          {!isClient && !isFreelancer && (
            <Card>
              <p className="text-sm text-slate-500">
                This account has no role assigned. Please contact support or adjust the role in admin.
              </p>
            </Card>
          )}
        </div>
      )}
    </PageContainer>
  );
}

function FreelancerProfileSummary({ profile, error }) {
  if (error) {
    return (
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My freelancer profile</h3>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
          <Link to="/profile/edit">
            <Button size="sm">Create / edit</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">My freelancer profile</h3>
          <p className="text-sm text-slate-500 mt-1">
            You don't have a profile yet. Create one to appear in freelancers.
          </p>
        </div>
        <Link to="/profile/edit">
          <Button size="sm">Create profile</Button>
        </Link>
      </Card>
    );
  }

  const skills =
    typeof profile.skills === "string"
      ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : profile.skills || [];

  return (
    <Card className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">My freelancer profile</h3>
          <div className="text-sm text-slate-600 mt-0.5">{profile.title || "No title yet"}</div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
            {profile.experience_level && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 border border-indigo-100">
                {profile.experience_level}
              </span>
            )}
            {profile.hourly_rate != null && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                €{profile.hourly_rate}/h
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/freelancers/${profile.id}`}>
            <Button size="sm" variant="outline">View public</Button>
          </Link>
          <Link to="/profile/edit">
            <Button size="sm">Edit</Button>
          </Link>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {skill}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

function ClientDashboardList({ jobs }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">My jobs</h3>
        <Link to="/jobs/new">
          <Button size="sm">Post a new job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <div className="text-center py-6">
            <svg className="mx-auto h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <p className="text-sm text-slate-500">
              You haven't posted any jobs yet. Start by creating your first opportunity.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} hover className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{job.title}</h4>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                  <span>{job.location || "Remote"}</span>
                  {job.status && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                        {job.status}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {job.created_at
                    ? `Posted on ${new Date(job.created_at).toLocaleDateString()}`
                    : "Posted recently"}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                {job.proposals_count != null && (
                  <div className="text-xs text-slate-600">
                    Proposals: <span className="font-bold text-indigo-600">{job.proposals_count}</span>
                  </div>
                )}
                <Link to={`/jobs/${job.id}`}>
                  <Button size="sm" variant="outline">View job</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FreelancerDashboardList({ proposals }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900">My proposals</h3>

      {proposals.length === 0 ? (
        <Card>
          <div className="text-center py-6">
            <p className="text-sm text-slate-500">
              You haven't submitted any proposals yet. Browse jobs and apply to start working.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <Card key={proposal.id} hover className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Job
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                    {proposal.job?.title || "Untitled job"}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {proposal.job?.company || proposal.job?.client_name
                      ? proposal.job.company || proposal.job.client_name
                      : "Client"}
                  </div>
                </div>
                <Link to={proposal.job ? `/jobs/${proposal.job.id}` : "/jobs"}>
                  <Button size="sm" variant="outline">View job</Button>
                </Link>
              </div>

              {proposal.cover_letter && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Your cover letter
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-line line-clamp-3">
                    {proposal.cover_letter}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                  {proposal.proposed_budget != null && (
                    <span>
                      Budget: <span className="font-semibold text-slate-700">€{proposal.proposed_budget}</span>
                    </span>
                  )}
                  {proposal.estimated_days != null && (
                    <span>
                      ETA: <span className="font-semibold text-slate-700">{proposal.estimated_days} days</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {proposal.created_at
                    ? `Sent on ${new Date(proposal.created_at).toLocaleDateString()}`
                    : "Sent recently"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
