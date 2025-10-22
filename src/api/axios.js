// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-be-two.vercel.app/", // ✅ single backend URL
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
