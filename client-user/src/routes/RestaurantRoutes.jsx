import { Route } from "react-router-dom";

// Pages
import RestaurantLogin from "../pages/restaurant/RestaurantLogin";
import RestaurantSignup from "../pages/restaurant/RestaurantSignup";
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import RestaurantCreateFood from "../pages/restaurant/RestaurantCreateFood";
import RestaurantManageFoods from "../pages/restaurant/RestaurantManageFoods";
import RestaurantOrders from "../pages/restaurant/RestaurantOrders"; // ✅ Import Orders page

// Layout & Protection
import ProtectedRoute from "./ProtectedRoute";
import RestaurantLayout from "../layouts/RestaurantLayout";

const RestaurantRoutes = [
  // Public Routes
  <Route key="restaurant-login" path="/restaurant/login" element={<RestaurantLogin />} />,
  <Route key="restaurant-signup" path="/restaurant/signup" element={<RestaurantSignup />} />,

  // Protected Routes
  <Route
    key="restaurant"
    path="/restaurant"
    element={
      <ProtectedRoute role="restaurant">
        <RestaurantLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<RestaurantDashboard />} />
    <Route path="profile" element={<RestaurantProfile />} />
    <Route path="create-food" element={<RestaurantCreateFood />} />
    <Route path="manage-foods" element={<RestaurantManageFoods />} />
    <Route path="orders" element={<RestaurantOrders />} /> {/* ✅ Orders Route */}
  </Route>,
];

export default RestaurantRoutes;
