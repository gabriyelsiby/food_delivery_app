import { Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";

import Home from "../pages/Home";
import UserLogin from "../pages/user/UserLogin";
import UserSignup from "../pages/user/UserSignup";
import Cart from "../pages/user/Cart";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";
import Checkout from "../pages/user/Checkout";
import ProtectedRoute from "./ProtectedRoute";

const UserRoutes = (
  <>
    {/* Public Routes */}
    <Route path="/" element={<UserLayout />}>
      <Route index element={<Home />} />
    </Route>

    {/* Login/Signup with no layout */}
    <Route element={<UserLayout />}>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
    </Route>

    {/* Protected Routes with full layout */}
    <Route
      path="/"
      element={
        <ProtectedRoute role="user">
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="user/orders" element={<Orders />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  </>
);

export default UserRoutes;
