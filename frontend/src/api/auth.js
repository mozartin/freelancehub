import api from "./axios";

// Login
export async function loginRequest(email, password) {
  const response = await api.post("/login", {
    email,
    password,
  });

  return response.data; // получим { user, token }
}

// Logout
export async function logoutRequest() {
  const response = await api.post("/logout");
  return response.data;
}

// Register
export async function registerRequest(payload) {
  const response = await api.post("/users", payload);
  return response.data;
}
