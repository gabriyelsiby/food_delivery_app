import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RestaurantLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/restaurant/dashboard", label: "Dashboard" },
    { path: "/restaurant/add-food", label: "Add Food" },
    { path: "/restaurant/orders", label: "Orders" },
    { path: "/restaurant/profile", label: "Profile" }
  ];

  const handleLogout = async () => {
    try {
      // Send logout request to the backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/restaurant/logout`, null, {
        withCredentials: true // Ensures that the cookie is sent
      });

      if (response.status === 200) {
        // Redirect to login page after successful logout
        navigate("/restaurant/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between p-4">
        <div>
          <h2 className="text-2xl font-bold mb-6">Restaurant Panel</h2>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block p-2 rounded mb-2 ${
                location.pathname === link.path ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default RestaurantLayout;
