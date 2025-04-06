import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Fetch user profile on app load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/profile", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setUser(null);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Fetch and store user after login or signup
  const login = async () => {
    try {
      const res = await axios.get("/user/profile", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user after login:", err);
    }
  };

  // ✅ Logout user and clear session
  const logout = async () => {
    try {
      await axios.get("/user/logout", { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
