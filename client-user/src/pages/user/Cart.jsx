// pages/user/Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart");
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, i) => (
            <div key={i} className="p-4 border rounded-lg shadow">
              <p className="text-lg font-medium">{item.foodItem.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              <p className="text-sm text-gray-600">Price: ₹{item.foodItem.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
