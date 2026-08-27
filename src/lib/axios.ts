import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://0hw8tf6g-3001.inc1.devtunnels.ms/",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token and device headers on every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token") || Cookies.get("auth-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Add required device headers
    config.headers.deviceuniqueid = "web-client-id";
    config.headers.devicemodel = navigator.userAgent;
  }
  return config;
});

// Handle 401 Unauthorized errors and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-user");
      Cookies.remove("auth-token", { path: "/" });

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth/")) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
