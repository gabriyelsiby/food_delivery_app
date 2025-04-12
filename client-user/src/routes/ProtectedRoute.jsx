import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRestaurantAuth } from "../context/RestaurantAuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, isAdmin, isUser, authLoading } = useAuth();
  const { restaurant, loading: restaurantLoading } = useRestaurantAuth();

  const isRestaurant = !!restaurant;

  const isLoading = authLoading || restaurantLoading;

  if (isLoading) return <div className="text-center py-10">Checking auth...</div>;

  // Not logged in
  if (
    (role === "admin" || role === "user") && !isLoggedIn ||
    role === "restaurant" && !isRestaurant
  ) {
    const redirectPath = role === "restaurant" ? "/restaurant/login" : "/login";
    return <Navigate to={redirectPath} replace />;
  }

  // Role mismatch
  if (role === "admin" && !isAdmin) return <Navigate to="/" replace />;
  if (role === "user" && !isUser) return <Navigate to="/admin/dashboard" replace />;
  if (role === "restaurant" && !isRestaurant) return <Navigate to="/restaurant/login" replace />;

  return children;
};

export default ProtectedRoute;
