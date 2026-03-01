import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import JobCard from "../components/jobs/JobCard";
import Button from "../components/ui/Button";
import { getJobs } from "../api/jobs";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useDocumentTitle("Jobs");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (query = "") => {
    try {
      setLoading(true);
      setError("");
      const list = await getJobs(query);
      setJobs(list || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <PageContainer
      title="Jobs"
      subtitle="Browse open freelance opportunities powered by your Laravel API."
    >
      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by job title, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 hover:border-slate-300"
          />
        </div>
        <Button type="submit" className="sm:w-auto w-full">
          Search
        </Button>
      </form>

      {/* States */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8">
          <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading jobs...
        </div>
      )}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
          <svg className="mx-auto h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          <p className="text-sm text-slate-500">
            No jobs found. Try adjusting your search.
          </p>
        </div>
      )}

      {/* Jobs list */}
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
    </PageContainer>
  );
}
