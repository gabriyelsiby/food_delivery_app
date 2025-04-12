import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import axios from "../config/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔁 Check login status from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth(); // Initial check
    window.addEventListener("storage", checkAuth); // Sync across tabs
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/user/logout", null, { withCredentials: true });
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  const guestNav = [
    { name: "Login", path: "/login" },
    { name: "Signup", path: "/register" },
  ];

  const userNav = [
    { name: "Home", path: "/" },
    { name: "Cart", path: "/cart" },
    { name: "Orders", path: "/orders" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1
          className="text-2xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          🍔 Foodie
        </h1>

        {/* 💻 Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          {(isAuthenticated ? userNav : guestNav).map((item) => (
            <li
              key={item.name}
              className="hover:text-primary transition cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
          {isAuthenticated && (
            <li
              className="text-red-500 hover:text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          )}
        </ul>

        {/* 📱 Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="space-y-3 text-gray-700 font-medium">
            {(isAuthenticated ? userNav : guestNav).map((item) => (
              <li
                key={item.name}
                className="hover:text-primary cursor-pointer"
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.name}
              </li>
            ))}
            {isAuthenticated && (
              <li
                className="text-red-500 hover:text-red-600 cursor-pointer"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
