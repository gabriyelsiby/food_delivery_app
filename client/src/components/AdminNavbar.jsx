import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navLinkClass = (path) =>
    `px-4 py-2 rounded ${pathname === path ? "bg-rose-600 text-white" : "text-gray-700 hover:bg-rose-100"}`;

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      navigate("/login"); // Redirecting to the login page after logout
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-rose-600">Admin Panel</h1>

      <div className="flex space-x-4 items-center">
        <Link to="/admin/restaurants" className={navLinkClass("/admin/restaurants")}>
          Manage Restaurants
        </Link>
        <Link to="/admin/orders" className={navLinkClass("/admin/orders")}>
          Assign Orders
        </Link>
        <Link to="/admin/coupons" className={navLinkClass("/admin/coupons")}>
          Create Coupons
        </Link>
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
