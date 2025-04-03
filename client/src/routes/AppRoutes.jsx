import { Routes, Route } from "react-router-dom";
import FirstViewLayout from "../layouts/FirstViewLayout";
import MainLayout from "../layouts/MainLayout"; // ✅ Includes Navbar
import UserLogin from "../pages/login/UserLogin";
import UserSignup from "../pages/signup/UserSignup";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (No Navbar) */}
      <Route element={<FirstViewLayout />}>
        <Route path="/" element={<Home />} /> {/* ✅ Home is public */}
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/signup/user" element={<UserSignup />} />
      </Route>

      {/* Protected Routes (With Navbar) */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} /> {/* ✅ Redirects Here After Login */}
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
