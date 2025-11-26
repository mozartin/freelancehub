import api from "./axios";

// Create proposal for a specific job
export async function createProposal(jobId, payload) {
console.log(payload);

  const response = await api.post(`/jobs/${jobId}/proposals`, payload);
  return response.data;
}
