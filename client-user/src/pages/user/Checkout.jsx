import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";  // Access cart store
import axiosInstance from "../../config/axiosInstance";  // Axios instance for API requests

const Checkout = () => {
  const { cart } = useCartStore();  // Fetch cart data from store
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart?.items) {
      calculateTotalPrice();
    }
  }, [cart, discount]);

  const calculateTotalPrice = () => {
    let price = 0;
    cart.items.forEach((item) => {
      price += item.price * item.quantity;
    });
    setTotalPrice(price);
    setFinalPrice(Math.max(price - discount, 0)); // Apply discount but ensure it's not negative
  };

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      alert("Address and payment method are required.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurantId: cart.items[0]?.restaurantId,  // Assuming all items are from the same restaurant
        items: cart.items,
        discount,
        address,
        paymentMethod,
      };

      const response = await axiosInstance.post("order/place-order", orderData, { withCredentials: true });

      if (response.status === 201) {
        const orderId = response.data.data._id;
        // Redirect to order summary page
        navigate(`/order-summary/${orderId}`);
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">Checkout</h1>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Order Summary</h2>
        <ul className="space-y-3">
          {cart.items?.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
          <label className="block mt-2">
            Discount: ₹
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              max={totalPrice}
              min={0}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </label>
          <p className="mt-2">Final Price: ₹{finalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium">Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address"
          required
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded-md ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} transition duration-300`}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
