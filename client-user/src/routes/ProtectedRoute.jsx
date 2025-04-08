import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, isAdmin, isUser, authLoading } = useAuth();

  // 🔄 Show nothing (or a spinner) until auth is checked
  if (authLoading) return <div className="text-center py-10">Checking auth...</div>;

  // 🔐 Not logged in
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // 🔒 Role-based access
  if (role === "admin" && !isAdmin) return <Navigate to="/" replace />;
  if (role === "user" && !isUser) return <Navigate to="/admin/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
