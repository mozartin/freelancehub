// src/api/axios.js
import axios from "axios";

// Resolve API URL, always ensuring it includes /api and no trailing slash duplication
const getApiUrl = () => {
  const raw =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://127.0.0.1:8001/api"
      : "https://freelancehub-o546.onrender.com/api");

  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: false,
});     

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  console.log(config);
   console.log(token);
  return config;
});

export default api;
       