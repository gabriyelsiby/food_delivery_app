import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar /> {/* ✅ Always shows Navbar */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
