import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* App Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">FoodieExpress</h2>
          <p className="mt-3 text-sm">
            Fast, fresh, and delivered to your door. Your cravings, our mission!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-rose-400">Home</Link></li>
            <li><Link to="/cart" className="hover:text-rose-400">Cart</Link></li>
            <li><Link to="/user/orders" className="hover:text-rose-400">My Orders</Link></li>
            <li><Link to="/profile" className="hover:text-rose-400">Profile</Link></li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect with us</h3>
          <p className="text-sm">support@foodieexpress.com</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-rose-400"><Facebook size={20} /></a>
            <a href="#" className="hover:text-rose-400"><Instagram size={20} /></a>
            <a href="#" className="hover:text-rose-400"><Twitter size={20} /></a>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-sm text-center text-gray-500">
        &copy; {currentYear} FoodieExpress. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
