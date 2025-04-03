import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>
        <div className="space-x-4">
          <Link to="/admin/restaurants" className="hover:underline">Manage Restaurants</Link>
          <Link to="/admin/orders" className="hover:underline">Manage Orders</Link>
          <Link to="/admin/users" className="hover:underline">Manage Users</Link>
          <Link to="/admin/coupons" className="hover:underline">Coupons</Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
