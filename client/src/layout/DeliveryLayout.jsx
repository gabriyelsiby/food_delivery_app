import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import DeliveryNavbar from "../components/DeliveryNavbar"; // Adjust the path based on your file structure

const DeliveryLayout = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/delivery/logout`, null, {
        withCredentials: true, // Ensures cookie is sent
      });
      navigate("/delivery/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Include DeliveryNavbar inside DeliveryLayout */}
      <DeliveryNavbar onLogout={handleLogout} />

      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {/* Render the content of the current page */}
        <Outlet />
      </main>
    </div>
  );
};

export default DeliveryLayout;
