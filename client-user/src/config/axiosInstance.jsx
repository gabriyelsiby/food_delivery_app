// config/axiosInstance.jsx
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL|| "https://food-delivery-app-server-sooty.vercel.app/api",
  withCredentials: true,
});

export default axiosInstance;
