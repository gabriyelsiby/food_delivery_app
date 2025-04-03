import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-6 text-center md:text-left">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-semibold">Food Delivery App</h2>
          <p className="text-gray-400 mt-2">Delivering happiness, one meal at a time.</p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <ul className="mt-2">
            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link to="/restaurants" className="text-gray-400 hover:text-white">Restaurants</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Partner Links */}
        <div>
          <h2 className="text-lg font-semibold">Join Us</h2>
          <ul className="mt-2">
            <li><Link to="/signup/restaurant" className="text-gray-400 hover:text-white">Become a Restaurant Partner</Link></li>
            <li><Link to="/signup/delivery" className="text-gray-400 hover:text-white">Become a Delivery Partner</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold">Follow Us</h2>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 mt-6 text-sm">
        &copy; {new Date().getFullYear()} Food Delivery App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
