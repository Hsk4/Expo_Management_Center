import axios from "axios"
import { clearAuthCookies } from "../utils/cookieUtils"

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
})

// Add request interceptor to attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear auth data
            const storedUser = localStorage.getItem("user");
            let redirectPath = "/";

            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    // Redirect to appropriate login based on user role
                    if (user.role === "admin") {
                        redirectPath = "/admin/login";
                    } else if (user.role === "exhibitor") {
                        redirectPath = "/exhibitor/login";
                    } else if (user.role === "attendee") {
                        redirectPath = "/attendee/login";
                    }
                } catch (e) {
                    // If parsing fails, redirect to home
                    redirectPath = "/";
                }
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            clearAuthCookies();
            window.location.href = redirectPath;
        }
        return Promise.reject(error);
    }
);

export default api;