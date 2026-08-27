import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.dev.barhuddle.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token and device headers on every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Add required device headers
    config.headers.deviceuniqueid = "web-client-id"; // You can use a library like fingerprintjs for actual unique ID if needed
    config.headers.devicemodel = navigator.userAgent;
  }
  return config;
});

// Normalize error messages
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
