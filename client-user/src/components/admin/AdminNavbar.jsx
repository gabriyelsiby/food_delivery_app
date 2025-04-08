import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // Already handles redirect
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Restaurants", path: "/admin/restaurants" },
    { name: "Coupons", path: "/admin/coupons" },
    { name: "Orders", path: "/admin/orders" },
  ];

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">
          Foodie<span className="text-red-500">Admin</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-red-500" : "text-gray-700 hover:text-red-500"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">
              {user?.name || "Admin"}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4 pb-4">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block font-medium ${
                  isActive ? "text-red-500" : "text-gray-700 hover:text-red-500"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <span className="block text-sm text-gray-600">
            Hi, {user?.name || "Admin"}
          </span>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
