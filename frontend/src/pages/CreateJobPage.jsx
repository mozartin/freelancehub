import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { createJob } from "../api/jobs";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget_type: "hourly",
    budget_min: "",
    budget_max: "",
     skills: "",
    status: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useDocumentTitle("Post a job");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        status: 'open'
      };

      const created = await createJob(payload);

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
      subtitle="Describe your project and we’ll help you find the right freelancer."
    >
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && (
            <p className="text-sm text-emerald-600">{successMessage}</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-700 font-medium">Budget type</span>
              <select
                name="budget_type"
                value={form.budget_type}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/jobs")}
            >
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
