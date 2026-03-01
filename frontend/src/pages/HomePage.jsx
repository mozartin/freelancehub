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

  const heroSection = (
    <section className="w-full">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 animate-gradient px-6 sm:px-10 py-14 sm:py-20">
        {/* Decorative animated elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full animate-float-slow-reverse" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-white rounded-full animate-shimmer" />
        <div className="absolute -bottom-10 right-1/4 w-64 h-64 bg-violet-400/10 rounded-full animate-float-slow" />

        <div className="relative z-10 mx-auto max-w-6xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
          {/* Left — text content */}
          <div className="max-w-2xl lg:max-w-xl">
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

          {/* Right — portfolio card */}
          <div className="hidden lg:flex flex-shrink-0 w-80">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-xl w-full">
              <p className="text-sm font-semibold text-white mb-2">
                Portfolio Project
              </p>
              <p className="text-sm text-indigo-100/90 leading-relaxed mb-4">
                FreelanceHub is a full-stack demo app built by{" "}
                <span className="font-semibold text-white">Olena Beliavska</span>{" "}
                showcasing a complete freelance workflow: job postings, proposals,
                and user profiles.
              </p>
              <p className="text-xs text-indigo-200/70 leading-relaxed">
                Built with React + Tailwind CSS frontend, Laravel REST API with
                authentication, client/freelancer dashboards, and seeded sample
                data for quick exploration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <PageContainer hero={heroSection}>
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
