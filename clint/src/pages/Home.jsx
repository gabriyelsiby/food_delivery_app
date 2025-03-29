// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom"; // If you want to navigate to other pages like Menu

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Food Delivery App</h1>
        <p className="text-xl mb-8">Freshly prepared meals delivered to your doorsteps!</p>
        <Link to="/menu" className="text-blue-500 hover:text-blue-700 text-lg">
          View Menu
        </Link>
      </div>
    </div>
  );
};

export default Home;
