import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Fetch auth status on initial load
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  const fetchAuthStatus = async () => {
    setAuthLoading(true);
    try {
      const res = await axios.get("/user/check-auth", { withCredentials: true });

      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Failed to check auth:", err?.response?.data || err.message);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async () => {
    await fetchAuthStatus();
  };

  const logout = async () => {
    try {
      await axios.get("/user/logout", { withCredentials: true });
    } catch (error) {
      console.warn("⚠️ Logout issue:", error.response?.data || error.message);
    } finally {
      setUser(null);
      toast.success("Logout successful ✅");
      window.location.href = "/login";
    }
  };

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin,
        isUser,
        login,
        logout,
        authLoading, // optional: for conditional UI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
