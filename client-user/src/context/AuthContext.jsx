import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../config/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Re-run auth check on every route change
  useEffect(() => {
    fetchAuthStatus();
  }, [location.pathname]);

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
      navigate("/login", { replace: true }); // 👈 prevents going back
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
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
