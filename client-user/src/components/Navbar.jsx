import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    ...(isLoggedIn
      ? [
          { name: "Cart", path: "/cart" },
          { name: "Orders", path: "/user/orders" },
          { name: "Profile", path: "/profile" },
        ]
      : []),
  ];

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-rose-600">
          Foodie<span className="text-gray-900">Express</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-rose-600" : "text-gray-700 hover:text-rose-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Hi, {user?.name || "User"}</span>
              <button
                onClick={handleLogout}
                className="bg-rose-500 text-white px-3 py-1 rounded-md hover:bg-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="bg-rose-500 text-white px-4 py-1.5 rounded-md hover:bg-rose-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-md hover:bg-gray-200"
              >
                Signup
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
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
                  isActive ? "text-rose-600" : "text-gray-700 hover:text-rose-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <>
              <span className="block text-sm text-gray-600">
                Hi, {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="w-full bg-rose-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-rose-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-rose-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
