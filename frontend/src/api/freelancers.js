import api from "./axios";

// List freelancer profiles with pagination support
export async function getFreelancers(page = 1) {
  const response = await api.get("/freelancer-profiles", {
    params: { page },
  });

  const payload = response.data;

  // Laravel pagination returns an object with data + meta/links
  if (payload?.data && Array.isArray(payload.data)) {
    const meta =
      payload.meta ??
      (payload.current_page && payload.last_page
        ? {
            current_page: payload.current_page,
            last_page: payload.last_page,
          }
        : null);

    return { items: payload.data, meta };
  }

  // Fallback to array response
  if (Array.isArray(payload)) {
    return { items: payload, meta: null };
  }

  return { items: [], meta: null };
}

export async function getFreelancerProfile(id) {
  const response = await api.get(`/freelancer-profiles/${id}`);
  return response.data;
}

export async function getFreelancerProfileByUser(userId) {
  const response = await api.get(`/freelancer-profiles/user/${userId}`);
  return response.data;
}

export async function updateFreelancerProfile(id, payload) {
  const response = await api.put(`/freelancer-profiles/${id}`, payload);
  return response.data;
}

export async function createFreelancerProfile(payload) {
  const response = await api.post(`/freelancer-profiles`, payload);
  return response.data;
}

