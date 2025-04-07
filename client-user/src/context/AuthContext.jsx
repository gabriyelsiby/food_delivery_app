import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axiosInstance"; // Make sure this has withCredentials

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Fetch user profile on app load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/profile", { withCredentials: true });

        // Only set user if valid data exists
        if (res.data?.data) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("❌ Failed to load profile:", err?.response?.data || err.message);
        setUser(null);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Fetch and store user after login or signup
  const login = async () => {
    try {
      const res = await axios.get("/user/profile", { withCredentials: true });

      if (res.data?.data) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch user after login:", err);
    }
  };

  // ✅ Logout user and clear session
  const logout = async () => {
    try {
      await axios.get("/user/logout", { withCredentials: true });
      setUser(null);

      // Optional: redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Logout failed:", error);
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
