import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRestaurantAuth } from "../../context/RestaurantAuthContext";
import { LogOut } from "lucide-react";

const RestaurantNavbar = () => {
  const { restaurant, logout } = useRestaurantAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/restaurant/login");
  };

  return (
    <nav className="w-full px-6 py-3 bg-white shadow flex justify-between items-center">
      <div className="text-2xl font-bold text-orange-500">
        fppdeexpress 🍔
      </div>

      <ul className="flex gap-6 text-gray-700 font-medium">
        <li>
          <Link to="/restaurant/dashboard" className="hover:text-orange-500">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/restaurant/create-food" className="hover:text-orange-500">
            Add Food
          </Link>
        </li>
        <li>
          <Link to="/restaurant/manage-foods" className="hover:text-orange-500">
            Manage Foods
          </Link>
        </li>
        <li>
          <Link to="/restaurant/orders" className="hover:text-orange-500">
            Orders
          </Link>
        </li>
        <li>
          <Link to="/restaurant/profile" className="hover:text-orange-500">
            Profile
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 hidden md:block">
          {restaurant?.restaurantName}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default RestaurantNavbar;
