// src/api/axios.js
import axios from "axios";

// Resolve API URL, always ensuring it includes /api and no trailing slash duplication
const COOLIFY_API = "https://hlyizcistflugyxdbl1gtfw2.2.28.64.235.sslip.io/api";

const getApiUrl = () => {
  const fromEnv = import.meta.env.VITE_API_URL;
  // Ignore stale Render URL if still set in Vercel env
  const raw =
    fromEnv && !String(fromEnv).includes("onrender.com")
      ? fromEnv
      : import.meta.env.DEV
        ? "http://127.0.0.1:8001/api"
        : COOLIFY_API;

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
  return config;
});

export default api;
       