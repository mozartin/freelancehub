import { useEffect, useRef, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getJobById } from "../api/jobs";
import { createProposal } from "../api/proposals";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../auth/AuthContext";

export default function JobDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApplyForm, setShowApplyForm] = useState(() => {
      return searchParams.get("apply") === "1";
  });
  const [applyForm, setApplyForm] = useState({
    cover_letter: "",
    proposed_budget: "",
    estimated_days: "",
  });
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const applyFormRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const isFreelancer = user?.role === "freelancer";
  const isClient = user?.role === "client";
  const canApply = isAuthenticated && isFreelancer;

  useDocumentTitle(job?.title ? `${job.title}` : "Job details");

  useEffect(() => {

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
        if (searchParams.get("apply") === "1" && canApply) {
          setTimeout(() => {
            applyFormRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 150);
        } else if (searchParams.get("apply") === "1" && !canApply) {
          setShowApplyForm(false);
        }
      }
    };

    fetchJob();
  }, [id, canApply]);

  const handleApplyChange = (e) => {
    const { name, value } = e.target;
    setApplyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setApplyError("");
    setApplySuccess("");

    if (!canApply) {
      setApplyError(
        !isAuthenticated
          ? "Please log in as a freelancer to apply."
          : "Only freelancers can apply to jobs."
      );
      return;
    }

    if (!applyForm.cover_letter.trim()) {
      setApplyError("Please write a short cover letter.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        cover_letter: applyForm.cover_letter,
        proposed_budget: applyForm.proposed_budget
          ? Number(applyForm.proposed_budget)
          : null,
        estimated_days: applyForm.estimated_days
          ? Number(applyForm.estimated_days)
          : null,
      };

      await createProposal(id, payload);

      setApplySuccess("Your proposal has been submitted.");
      setApplyForm({
        cover_letter: "",
        proposed_budget: "",
        estimated_days: "",
      });
      setShowApplyForm(false);
    } catch (err) {
      console.error(err);
      setApplyError("Failed to submit proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="space-y-6">
        {/* Main job card */}
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
                  {job.budget_type === "hourly"
                    ? "Hourly rate"
                    : "Fixed budget"}
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

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {job.created_at
                ? `Posted on ${new Date(job.created_at).toLocaleDateString()}`
                : "Posted recently"}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/register?role=freelancer");
                    return;
                  }
                  if (!isFreelancer) {
                    return;
                  }
                  setShowApplyForm((prev) => !prev);
                }}
                disabled={isClient}
              >
                {showApplyForm
                  ? "Cancel"
                  : !isAuthenticated
                  ? "Apply for this job"
                  : isFreelancer
                  ? "Apply for this job"
                  : "Clients cannot apply"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Apply form */}
        {showApplyForm && canApply && (
          <div ref={applyFormRef}>
            <Card className="max-w-2xl">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Submit your proposal
              </h3>

              {applyError && (
                <p className="text-sm text-red-500 mb-2">{applyError}</p>
              )}
              {applySuccess && (
                <p className="text-sm text-emerald-600 mb-2">{applySuccess}</p>
              )}

              <form onSubmit={handleSubmitProposal} className="space-y-3">
                <Textarea
                  label="Cover letter"
                  name="cover_letter"
                  value={applyForm.cover_letter}
                  onChange={handleApplyChange}
                  rows={5}
                  placeholder="Briefly explain why you’re a good fit for this job..."
                />

                <Input
                  label="Proposed budget (optional)"
                  name="proposed_budget"
                  type="number"
                  min="0"
                  value={applyForm.proposed_budget}
                  onChange={handleApplyChange}
                  placeholder="e.g. 1200"
                  helperText="Total amount you propose for this project."
                />

                <Input
                  label="Estimated days to complete (optional)"
                  name="estimated_days"
                  type="number"
                  min="1"
                  value={applyForm.estimated_days}
                  onChange={handleApplyChange}
                  placeholder="e.g. 7"
                  helperText="Rough estimate of how many days you need."
                />

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowApplyForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Submit proposal"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
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
