// src/api/axios.js
import axios from "axios";

// Get API URL from environment variable
const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // In development, default to localhost
  if (import.meta.env.DEV) {
    return apiUrl || "http://127.0.0.1:8000/api";
  }
  
  // In production, require the environment variable
  if (!apiUrl) {
    console.error("VITE_API_URL is not set! Please configure it in your deployment platform.");
    throw new Error("API URL is not configured. Please set VITE_API_URL environment variable.");
  }
  
  return apiUrl;
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
       