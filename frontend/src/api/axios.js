// src/api/axios.js
import axios from "axios";

// Resolve API URL, always ensuring it includes /api and no trailing slash duplication
const COOLIFY_API = "https://hlyizcistflugyxdbl1gtfw2.2.28.64.235.sslip.io/api";

const normalizeApiUrl = (value) => {
  if (!value) return null;
  let raw = String(value).trim();
  // Guard against pasting "VITE_API_URL=https://..." into the env value
  raw = raw.replace(/^VITE_API_URL=/i, "").trim();
  if (!/^https?:\/\//i.test(raw)) return null;
  if (raw.includes("onrender.com")) return null;
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const getApiUrl = () => {
  const fromEnv = normalizeApiUrl(import.meta.env.VITE_API_URL);
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "http://127.0.0.1:8001/api";
  return COOLIFY_API;
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
