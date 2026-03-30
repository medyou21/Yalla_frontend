import axios from "axios";

// 🔹 Instance Axios
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ---------------- REQUEST INTERCEPTOR ----------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE INTERCEPTOR ----------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Ignorer les routes auth
    const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");

    // 🔒 Gestion 401 (token expiré)
    if (status === 401 && !isAuthRoute) {
      console.warn("🔒 Session expirée");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;