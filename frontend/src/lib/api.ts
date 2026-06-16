import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach admin token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle common response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Token expired or invalid – clear and redirect to login
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_name");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    if (error.response?.status === 503 && typeof window !== "undefined") {
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        icon: "warning",
        title: "Maintenance",
        text: "Sistem sedang maintenance. Silakan coba lagi nanti.",
        confirmButtonColor: "#22d3ee",
      });
    }
    return Promise.reject(error);
  }
);

export default api;
