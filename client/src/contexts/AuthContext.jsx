import { createContext, useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    return JSON.parse(localStorage.getItem("authUser")) || null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setUser(res.data.data);
        localStorage.setItem("authUser", JSON.stringify(res.data.data));
      } catch (error) {
        console.error("Auth Error:", error);
        setUser(null);
        localStorage.removeItem("authUser");
      }
    };

    // Fetch user only if a token exists (you may check cookies or headers)
    if (localStorage.getItem("authToken")) {
      fetchUser();
    }
  }, []);

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken"); // Remove auth token if stored
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
