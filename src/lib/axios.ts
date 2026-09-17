import axios from "axios";
import Cookies from "js-cookie";

/**
 * Retrieves or creates a persistent unique device ID for this browser / client.
 * This prevents multiple devices/browsers sharing the same device ID and causing
 * unexpected session invalidation across different devices.
 */
export function getDeviceUniqueId(): string {
  if (typeof window === "undefined") {
    return "web-server";
  }

  try {
    const storedId =
      localStorage.getItem("device_unique_id") ||
      Cookies.get("device_unique_id");

    if (storedId && storedId.trim().length > 0) {
      return storedId;
    }

    // Generate a unique identifier
    const newId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? `web-${crypto.randomUUID()}`
        : `web-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    localStorage.setItem("device_unique_id", newId);
    Cookies.set("device_unique_id", newId, { expires: 365, path: "/" });

    return newId;
  } catch {
    return "web-client";
  }
}

/**
 * Formats a clean, readable device model name based on the user agent and platform.
 */
export function getDeviceModel(): string {
  if (typeof window === "undefined" || !navigator) {
    return "Web Client";
  }

  try {
    const userAgent = navigator.userAgent;
    let browser = "Browser";
    let os = "Web";

    // Detect OS
    if (/Windows/i.test(userAgent)) os = "Windows";
    else if (/Macintosh|Mac OS X/i.test(userAgent)) os = "macOS";
    else if (/iPhone/i.test(userAgent)) os = "iPhone";
    else if (/iPad/i.test(userAgent)) os = "iPad";
    else if (/Android/i.test(userAgent)) os = "Android";
    else if (/Linux/i.test(userAgent)) os = "Linux";

    // Detect Browser
    if (/Edg/i.test(userAgent)) browser = "Edge";
    else if (/Chrome/i.test(userAgent) && !/Chromium|Edg/i.test(userAgent)) browser = "Chrome";
    else if (/Safari/i.test(userAgent) && !/Chrome|Chromium|Edg/i.test(userAgent)) browser = "Safari";
    else if (/Firefox/i.test(userAgent)) browser = "Firefox";
    else if (/Opera|OPR/i.test(userAgent)) browser = "Opera";

    return `${browser} on ${os}`;
  } catch {
    return navigator.userAgent || "Web Client";
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.staging.barhuddle.com/",
  timeout: 300000,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token and device headers on every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token") || Cookies.get("auth-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Add required unique device headers
    config.headers.deviceuniqueid = getDeviceUniqueId();
    config.headers.devicemodel = getDeviceModel();
  }

  // When sending FormData, let the browser set multipart/form-data with the correct boundary
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
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
