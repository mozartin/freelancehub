import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getJobById } from "../api/jobs";

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   useEffect(() => {
     console.log(id);
     
    if (!id) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-sm text-slate-500">Loading job...</p>;
    }

    if (error) {
      return <p className="text-sm text-red-500">{error}</p>;
    }

    if (!job) {
      return <p className="text-sm text-slate-500">Job not found.</p>;
    }

    const skills =
      typeof job.skills === "string"
        ? job.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : job.skills || [];

    const budgetLabel =
      job.budget_min && job.budget_max
        ? `${job.budget_min}–${job.budget_max} ${
            job.budget_type === "hourly" ? "€/h" : "€"
          }`
        : null;

    return (
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {job.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{job.company || job.client_name || "Client"}</span>
              <span>•</span>
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
          </div>

          {budgetLabel && (
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900">
                {budgetLabel}
              </div>
              <div className="text-xs text-slate-500">
                {job.budget_type === "hourly" ? "Hourly rate" : "Fixed budget"}
              </div>
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
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

        {job.description && (
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
              Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {job.created_at
              ? `Posted on ${new Date(job.created_at).toLocaleDateString()}`
              : "Posted recently"}
          </span>
          <Button>Apply for this job</Button>
        </div>
      </Card>
    );
  };

  return (
    <PageContainer
      title="Job details"
      subtitle="View the full description and requirements for this role."
    >
      <div className="mb-4">
        <Link
          to="/jobs"
          className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
        >
          <span>←</span>
          <span>Back to jobs</span>
        </Link>
      </div>

      {renderContent()}
    </PageContainer>
  );
}
