// src/components/CouponInput.jsx
import React, { useState } from "react";
import axios from "axios";

const CouponInput = ({ onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");

  const applyCoupon = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/api/coupon/apply",
        { couponCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setMessage("Coupon applied successfully!");
        // onCouponApplied can be used to update discount or cart totals
        onCouponApplied(res.data);
      })
      .catch((err) => {
        console.error("Coupon application error:", err);
        setMessage("Invalid coupon or error applying coupon.");
      });
  };

  return (
    <div className="mt-4">
      <form onSubmit={applyCoupon}>
        <label className="block mb-1">Coupon Code:</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">
          Apply Coupon
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default CouponInput;

