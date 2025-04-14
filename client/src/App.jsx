import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import RestaurantLayout from "./layout/RestaurantLayout";
import DeliveryLayout from "./layout/DeliveryLayout";

// User Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";

// Review Page
import ReviewPage from "./pages/ReviewPage";

// Food Details Page
import FoodDetails from "./pages/FoodDetails";

// Payment Pages
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/paymentCancel";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Restaurants from "./pages/admin/Restaurants";
import AdminOrders from "./pages/admin/Orders";
import Coupons from "./pages/admin/Coupons";

// Restaurant Pages
import RestaurantLogin from "./pages/restaurant/Login";
import RestaurantSignup from "./pages/restaurant/Signup";
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import AddFood from "./pages/restaurant/AddFood";
import RestaurantOrders from "./pages/restaurant/Orders";
import RestaurantProfile from "./pages/restaurant/Profile";

// Delivery Pages
import DeliveryLogin from "./pages/delivery/Login";
import DeliverySignup from "./pages/delivery/Signup";
import DeliveryDashboard from "./pages/delivery/Dashboard";
import AssignedOrders from "./pages/delivery/AssignedOrders";
import DeliveryProfile from "./pages/delivery/Profile";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* User Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Restaurant Public Routes */}
        <Route path="/restaurant/login" element={<RestaurantLogin />} />
        <Route path="/restaurant/signup" element={<RestaurantSignup />} />

        {/* Delivery Public Routes */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery/signup" element={<DeliverySignup />} />

        {/* Payment Pages */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* User Protected Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/reviews/:foodId" element={<ReviewPage />} />
          <Route path="/food/:foodId" element={<FoodDetails />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/Dashboard" element={<Dashboard />} />
          <Route path="/admin/restaurants" element={<Restaurants />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/coupons" element={<Coupons />} />
        </Route>

        {/* Restaurant Protected Routes */}
        <Route path="/restaurant" element={<RestaurantLayout />}>
          <Route path="dashboard" element={<RestaurantDashboard />} />
          <Route path="add-food" element={<AddFood />} />
          <Route path="orders" element={<RestaurantOrders />} />
          <Route path="profile" element={<RestaurantProfile />} />
        </Route>

        {/* Delivery Protected Routes */}
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="assigned-orders" element={<AssignedOrders />} />
          <Route path="profile" element={<DeliveryProfile />} />
        </Route>

        {/* Catch-all for undefined paths */}
        <Route
          path="*"
          element={<div className="text-center mt-10 text-gray-600">Page not found</div>}
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
