import { Link } from "react-router-dom";

const FirstViewNavbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-400">
          Food Delivery
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link to="/restaurants" className="hover:text-yellow-400 transition duration-200">
            Restaurants
          </Link>
          <Link to="/food-menu" className="hover:text-yellow-400 transition duration-200">
            Food Menu
          </Link>
          <Link to="/login/user" className="hover:text-yellow-400 transition duration-200">
            User Login
          </Link>
          <Link to="/login/restaurant" className="hover:text-yellow-400 transition duration-200">
            Restaurant Login
          </Link>
          <Link to="/login/delivery" className="hover:text-yellow-400 transition duration-200">
            Delivery Partner Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default FirstViewNavbar;
