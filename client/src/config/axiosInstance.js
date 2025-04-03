import axios from "axios";

// ✅ Ensure API_URL is set correctly
const API_URL = import.meta.env.VITE_API_URL || "https://food-delivery-app-server-sooty.vercel.app";

export const axiosInstance = axios.create({
    baseURL: `${API_URL}`,
    withCredentials: true, // ✅ Required for JWT Authentication with Cookies
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
