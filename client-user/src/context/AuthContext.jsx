import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axiosInstance";
import toast from "react-hot-toast"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Fetch user profile on app load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/profile", { withCredentials: true });

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

      toast.success("Logout successful ✅"); // ✅ Show success toast

      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
