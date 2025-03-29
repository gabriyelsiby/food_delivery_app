// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center p-4 mt-8">
      <p className="text-gray-600">&copy; {new Date().getFullYear()} FoodDeliveryApp. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
