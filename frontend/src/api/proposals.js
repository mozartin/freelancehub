import { api } from "./index";

// Create proposal for a specific job
export async function createProposal(jobId, payload) {
  const response = await api.post(`/api/jobs/${jobId}/proposals`, payload);
  return response.data;
}
