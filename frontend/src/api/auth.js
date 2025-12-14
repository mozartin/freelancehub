import api from "./axios";

// Login
export async function loginRequest(email, password) {
  const response = await api.post("/login", {
    email,
    password,
  });

  return response.data; // will get { user, token }
}

// Logout
export async function logoutRequest() {
  const response = await api.post("/logout");
  return response.data;
}

// Register
export async function registerRequest(payload) {
  const response = await api.post("/register", payload);
  return response.data;
}
