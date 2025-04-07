// src/routes/UserRoutes.jsx
import { Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home";
import UserLogin from "../pages/user/UserLogin";
import UserSignup from "../pages/user/UserSignup";
import Cart from "../pages/user/Cart";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";
import Checkout from "../pages/user/Checkout"; // Import Checkout page

const UserRoutes = (
  <Route path="/" element={<UserLayout />}>
    <Route index element={<Home />} />
    <Route path="login" element={<UserLogin />} />
    <Route path="signup" element={<UserSignup />} />
    <Route path="cart" element={<Cart />} />
    <Route path="checkout" element={<Checkout />} /> {/* Add Checkout Route */}
    <Route path="user/orders" element={<Orders />} />
    <Route path="profile" element={<Profile />} />
  </Route>
);

export default UserRoutes;
