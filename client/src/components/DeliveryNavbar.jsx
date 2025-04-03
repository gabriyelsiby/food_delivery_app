import React from "react";
import { Link } from "react-router-dom";

const DeliveryNavbar = () => {
  return (
    <nav className="bg-yellow-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/delivery/profile" className="text-xl font-bold">Delivery Partner</Link>
        <div className="space-x-4">
          <Link to="/delivery/orders" className="hover:underline">Assigned Orders</Link>
          <Link to="/delivery/profile" className="hover:underline">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default DeliveryNavbar;
