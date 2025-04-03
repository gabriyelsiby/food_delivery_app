import React from "react";
import { Link } from "react-router-dom";

const RestaurantNavbar = () => {
  return (
    <nav className="bg-green-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/restaurant/dashboard" className="text-xl font-bold">Restaurant Panel</Link>
        <div className="space-x-4">
          <Link to="/restaurant/manage-menu" className="hover:underline">Manage Menu</Link>
          <Link to="/restaurant/orders" className="hover:underline">Orders</Link>
          <Link to="/restaurant/profile" className="hover:underline">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default RestaurantNavbar;
