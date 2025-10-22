// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "task-manager-ep3wfw659-109tahas-projects.vercel.app", // ✅ single backend URL
});

// Automatically attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
