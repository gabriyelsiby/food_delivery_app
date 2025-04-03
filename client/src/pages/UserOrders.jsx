import { Routes, Route } from "react-router-dom";
import FirstViewLayout from "../layouts/FirstViewLayout"; 
import MainLayout from "../layouts/MainLayout"; // ✅ Import MainLayout
import UserLogin from "../pages/login/UserLogin";
import Home from "../pages/Home";
import Profile from "../pages/Profile"; // ✅ Add profile route
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ FirstViewLayout for non-logged-in users */}
      <Route element={<FirstViewLayout />}>
        <Route path="/login/user" element={<UserLogin />} />
      </Route>

      {/* ✅ MainLayout for logged-in users */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} /> {/* ✅ Home shows Navbar */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
