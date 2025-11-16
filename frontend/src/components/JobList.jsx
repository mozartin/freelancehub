// src/JobList.jsx
import { useEffect, useState } from "react";
import { api } from "../api";

export default function JobList() {
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

      const response = await api.get("/api/jobs", {
        params: query ? { q: query } : {},
      });

      // Laravel pagination → list is inside response.data.data
      const { data } = response.data;
      setJobs(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs...");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>FreelanceHub — Job Board</h1>
      <h1 className="text-4xl font-bold text-indigo-600 underline">
        Hello Tailwind v4 🎉
      </h1>
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
      >
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h2 style={{ margin: "0 0 0.5rem" }}>{job.title}</h2>
            <p style={{ margin: "0 0 0.5rem" }}>
              {job.description?.slice(0, 200)}...
            </p>

            {job.skills && (
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                Skills: {job.skills}
              </p>
            )}

            {job.budget_min && (
              <p style={{ fontSize: "0.9rem" }}>
                Budget: {job.budget_min} – {job.budget_max} ({job.budget_type})
              </p>
            )}

            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              Status: {job.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
