import { api } from "./index";

// List jobs
export async function getJobs(query = "") {
  const params = query ? { q: query } : {};
  const response = await api.get("/api/jobs", { params });

  const payload = response.data;

  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.data?.data && Array.isArray(payload.data.data))
    return payload.data.data;

  return [];
}

// Single job
export async function getJobById(id) {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
}

// Create job 
export async function createJob(payload) {
  const response = await api.post("/api/jobs", payload);
  return response.data;
}
