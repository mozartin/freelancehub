import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import JobCard from "../components/jobs/JobCard";
import Button from "../components/ui/Button";
import { getJobs } from "../api/jobs";


export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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
        className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <input
          type="text"
          placeholder="Search by job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button type="submit" className="sm:w-auto w-full">
          Search
        </Button>
      </form>

      {/* States: loading / error / empty */}
      {loading && <p className="text-sm text-slate-500">Loading jobs...</p>}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-sm text-slate-500">
          No jobs found. Try adjusting your search.
        </p>
      )}

      {/* Jobs list */}
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
