import { Link } from "react-router-dom";

const RestaurantNavbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">MyRestaurant Panel</div>
      <ul className="flex space-x-6">
        <li><Link to="/restaurant/dashboard" className="hover:text-yellow-400">Dashboard</Link></li>
        <li><Link to="/restaurant/orders" className="hover:text-yellow-400">Orders</Link></li>
        <li><Link to="/restaurant/add-food" className="hover:text-yellow-400">Add Food</Link></li>
        <li><Link to="/restaurant/profile" className="hover:text-yellow-400">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default RestaurantNavbar;
