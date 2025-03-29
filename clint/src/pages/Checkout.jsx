// src/pages/Checkout.jsx
import React, { useState } from "react";
import CouponInput from "../components/CouponInput";

const Checkout = () => {
  const [orderTotal, setOrderTotal] = useState(50.0); // Example initial total
  const [discount, setDiscount] = useState(0);

  const handleCouponApplied = (couponData) => {
    // Assume couponData contains a discount percentage or fixed amount
    // Here we'll assume it returns a discount amount for simplicity.
    setDiscount(couponData.discount);
    setOrderTotal((prevTotal) => prevTotal - couponData.discount);
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p>
        <strong>Order Total:</strong> ${orderTotal.toFixed(2)}
      </p>
      <CouponInput onCouponApplied={handleCouponApplied} />
      {/* Additional checkout logic (address, payment, etc.) */}
    </div>
  );
};

export default Checkout;
