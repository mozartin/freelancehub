import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const isClient = user?.role === "client";
  const isFreelancer = user?.role === "freelancer";

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";
        if (isClient) {
          url = "/dashboard/client";
        } else if (isFreelancer) {
          url = "/dashboard/freelancer";
        } else {
          setItems([]);
          return;
        }

        const res = await api.get(url);
        const data = res.data.data ?? res.data;
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isClient, isFreelancer]);

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
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-slate-500">
          Signed in as{" "}
          <span className="font-medium text-slate-800">{user?.name}</span>{" "}
          <span className="text-slate-400">({user?.role})</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/jobs"
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Browse jobs
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      ) : (
        <div className="space-y-4">
          {isClient && <ClientDashboardList jobs={items} />}
          {isFreelancer && <FreelancerDashboardList proposals={items} />}

          {!isClient && !isFreelancer && (
            <Card>
              <p className="text-sm text-slate-500">
                This account has no role assigned. Please contact support or
                adjust the role in admin.
              </p>
            </Card>
          )}
        </div>
      )}
    </PageContainer>
  );
}

function ClientDashboardList({ jobs }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">My jobs</h3>
        <Link to="/jobs/new">
          <Button size="sm">Post a new job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">
            You haven’t posted any jobs yet. Start by creating your first
            opportunity.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {job.title}
                </h4>
                <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-2">
                  <span>{job.location || "Remote"}</span>
                  {job.status && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                        {job.status}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {job.created_at
                    ? `Posted on ${new Date(
                        job.created_at
                      ).toLocaleDateString()}`
                    : "Posted recently"}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                {job.proposals_count != null && (
                  <div className="text-xs text-slate-600">
                    Proposals:{" "}
                    <span className="font-semibold">{job.proposals_count}</span>
                  </div>
                )}
                <Link to={`/jobs/${job.id}`}>
                  <Button size="sm" variant="outline">
                    View job
                  </Button>
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
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">My proposals</h3>

      {proposals.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">
            You haven’t submitted any proposals yet. Browse jobs and apply to
            start working.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Job
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {proposal.job?.title || "Untitled job"}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {proposal.job?.company || proposal.job?.client_name
                      ? proposal.job.company || proposal.job.client_name
                      : "Client"}
                  </div>
                </div>
                <Link to={proposal.job ? `/jobs/${proposal.job.id}` : "/jobs"}>
                  <Button size="sm" variant="outline">
                    View job
                  </Button>
                </Link>
              </div>

              {proposal.cover_letter && (
                <div className="pt-1 border-t border-slate-100">
                  <div className="text-xs font-medium text-slate-700 mb-1">
                    Your cover letter
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-line line-clamp-3">
                    {proposal.cover_letter}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                  {proposal.proposed_budget != null && (
                    <span>
                      Budget:{" "}
                      <span className="font-medium">
                        €{proposal.proposed_budget}
                      </span>
                    </span>
                  )}
                  {proposal.estimated_days != null && (
                    <span>
                      ETA:{" "}
                      <span className="font-medium">
                        {proposal.estimated_days} days
                      </span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {proposal.created_at
                    ? `Sent on ${new Date(
                        proposal.created_at
                      ).toLocaleDateString()}`
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
