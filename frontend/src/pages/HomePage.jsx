import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import JobCard from "../components/jobs/JobCard";
import { getJobs } from "../api/jobs";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const isFreelancer = user?.role === "freelancer";

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState("");

  useDocumentTitle("Home");

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoadingJobs(true);
        setErrorJobs("");
        const list = await getJobs();
        setJobs((list || []).slice(0, 3));
      } catch (err) {
        console.error(err);
        setErrorJobs("Failed to load latest jobs.");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchLatestJobs();
  }, []);

  return (
    <PageContainer>
      {/* Hero section */}
      <section className="mb-12 sm:mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 animate-gradient px-6 sm:px-10 py-10 sm:py-14">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-medium mb-5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Platform is live — start exploring
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Find your next freelance project or hire top talent.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-xl">
              FreelanceHub connects experienced developers and clients through a
              clean, focused workflow. Browse jobs, send proposals, and manage
              your work — all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/jobs">
                <Button
                  variant="outline"
                  className="!bg-white !text-indigo-700 !border-white/20 hover:!bg-indigo-50 !shadow-lg w-full sm:w-auto"
                >
                  Browse jobs
                </Button>
              </Link>
              {!isFreelancer && (
                <Link to={isAuthenticated ? "/jobs/new" : "/register?role=client"}>
                  <Button
                    variant="outline"
                    className="!bg-transparent !border-white/30 !text-white hover:!bg-white/10 w-full sm:w-auto"
                  >
                    Post a job
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Open jobs", value: jobs.length > 0 ? `${jobs.length}+` : "..." },
            { label: "Freelancers", value: "Active" },
            { label: "Tech stack", value: "React + Laravel" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-3 px-2 rounded-2xl bg-white border border-slate-100 shadow-sm"
            >
              <div className="text-lg sm:text-xl font-bold text-slate-900">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio badge */}
      <section className="mb-10">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-violet-50/80 px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/25">
                OB
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Portfolio Project by Olena Beliavska
                </p>
                <p className="text-xs text-slate-500">
                  Full-stack demo: job postings, proposals, client/freelancer dashboards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest jobs */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Latest jobs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Fresh opportunities posted by clients
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {loadingJobs && (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
            <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading latest jobs...
          </div>
        )}

        {errorJobs && <p className="text-sm text-red-500 mb-2">{errorJobs}</p>}

        {!loadingJobs && !errorJobs && jobs.length === 0 && (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">
              No jobs found yet. Be the first to post one!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {jobs.map((job) => {
            const skills =
              typeof job.skills === "string"
                ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
                : job.skills || [];

            let budgetLabel = "";
            if (job.budget_min && job.budget_max) {
              budgetLabel = `${job.budget_min}–${job.budget_max} ${
                job.budget_type === "hourly" ? "€/h" : "€"
              }`;
            }

            return (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company || job.client_name || "Client"}
                location={job.location || "Remote"}
                type={job.budget_type === "hourly" ? "Hourly" : "Fixed-price"}
                budget={budgetLabel}
                skills={skills}
                createdAt={
                  job.created_at
                    ? new Date(job.created_at).toLocaleDateString()
                    : "Posted recently"
                }
              />
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
}
