import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { createJob } from "../api/jobs";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../auth/AuthContext";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget_type: "hourly",
    budget_min: "",
    budget_max: "",
    skills: "",
    status: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useDocumentTitle("Post a job");

  // Only clients can post jobs
  if (user && user.role !== "client") {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center pt-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Access denied</h2>
          <p className="text-sm text-slate-500 mb-5">
            Only clients can post jobs. You are logged in as a{" "}
            <span className="font-semibold text-slate-700">{user.role}</span>.
          </p>
          <Link to="/jobs">
            <Button variant="outline">Browse jobs instead</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: form.title,
        description: form.description,
        budget_type: form.budget_type,
        budget_min: form.budget_min ? Number(form.budget_min) : null,
        budget_max: form.budget_max ? Number(form.budget_max) : null,
        skills: form.skills,
        status: "open",
      };

      await createJob(payload);
      setSuccessMessage("Job created successfully.");

      setTimeout(() => {
        navigate("/jobs");
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Failed to create job. Please check the form and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Post a new job"
      subtitle="Describe your project and we'll help you find the right freelancer."
    >
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}
          {successMessage && (
            <div className="flex items-start gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {successMessage}
            </div>
          )}

          <Input
            label="Job title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Frontend React Developer for marketing website"
          />

          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the project, scope, expectations, and any important requirements..."
            rows={6}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-slate-700 font-medium tracking-tight">
                Budget type
              </span>
              <select
                name="budget_type"
                value={form.budget_type}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white hover:border-slate-300"
              >
                <option value="hourly">Hourly</option>
                <option value="fixed">Fixed price</option>
              </select>
            </label>

            <Input
              label="Budget min"
              name="budget_min"
              type="number"
              min="0"
              value={form.budget_min}
              onChange={handleChange}
              placeholder="e.g. 30"
            />

            <Input
              label="Budget max"
              name="budget_max"
              type="number"
              min="0"
              value={form.budget_max}
              onChange={handleChange}
              placeholder="e.g. 50"
            />
          </div>

          <Input
            label="Skills (comma separated)"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g. React, TypeScript, Tailwind, REST API"
            helperText="You can enter a comma-separated list of skills."
          />

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => navigate("/jobs")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post job"}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
