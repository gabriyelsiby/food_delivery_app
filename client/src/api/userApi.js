import axiosInstance from "../config/axiosInstance";

// ✅ User Signup API
export const userSignup = async (userData) => {
  try {
    const response = await axiosInstance.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// ✅ User Login API
export const userLogin = async (credentials) => {
  try {
    const response = await axiosInstance.post("/user/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};
