import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true, // Ensures cookies are sent (JWT Auth)
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
