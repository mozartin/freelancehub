import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import JobCard from "../components/jobs/JobCard";
import { getJobs } from "../api/jobs";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState("");

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoadingJobs(true);
        setErrorJobs("");

        const list = await getJobs();
        // Just take first 3 jobs for homepage
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
      <section className="mb-10 sm:mb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Find your next freelance project or hire top talent.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              FreelanceHub connects experienced developers and clients through a
              clean, focused workflow. Browse jobs, send proposals, and manage
              your work in one place.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link to="/jobs">
                <Button className="w-full sm:w-auto">Browse jobs</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                type="button"
              >
                Post a job
              </Button>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 sm:max-w-xs">
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-xs text-slate-700">
              <p className="font-medium text-indigo-900 mb-1">
                Portfolio Project
              </p>

              <p className="mb-2">
                FreelanceHub is a full-stack demo app built by
                <span className="font-semibold text-indigo-700">
                  {" "}
                  Olena Beliavska  
                </span> as part of her developer portfolio.
              </p>

              <p className="text-[11px] text-slate-500">
                Built with React, Tailwind CSS, and Laravel. Designed to
                demonstrate clean UI, routing, and real API integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest jobs */}
      <section className="border-t border-slate-200 pt-6 sm:pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Latest jobs</h2>
          <Link
            to="/jobs"
            className="text-xs text-indigo-600 hover:text-indigo-700"
          >
            View all jobs
          </Link>
        </div>

        {loadingJobs && (
          <p className="text-sm text-slate-500">Loading latest jobs...</p>
        )}

        {errorJobs && <p className="text-sm text-red-500 mb-2">{errorJobs}</p>}

        {!loadingJobs && !errorJobs && jobs.length === 0 && (
          <p className="text-sm text-slate-500">
            No jobs found yet. Try creating one from your dashboard.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {jobs.map((job) => {
            const skills =
              typeof job.skills === "string"
                ? job.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
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
