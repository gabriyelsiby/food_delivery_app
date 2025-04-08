import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import axiosInstance from "../../config/axiosInstance";

const Checkout = () => {
  const { cart, clearCart, fetchCart } = useCartStore();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.totalPrice || 0;
  const discount = cart.discount || 0;
  const finalAmount = (total - discount).toFixed(2);

  useEffect(() => {
    fetchCart();
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get("/coupon/available");
      setAvailableCoupons(res.data.data);
    } catch (err) {
      console.error("Failed to load coupons", err);
    }
  };

  const handleApplyCoupon = async (code) => {
    try {
      const res = await axiosInstance.post("/coupon/apply", {
        code,
        orderId: cart.orderId,
      });
      setCouponMessage(res.data.message);
      setAppliedCoupon(code);
      fetchCart();
    } catch (err) {
      setCouponMessage(err.response?.data?.message || "Coupon failed");
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) return alert("Please enter your address.");

    const restaurantId = cart.items[0]?.restaurantId;
    if (!restaurantId) return alert("Missing restaurant info");

    setLoading(true);
    try {
      const res = await axiosInstance.post("/orders", {
        restaurantId,
        items: cart.items,
        discount,
        address,
        paymentMethod,
      });

      clearCart();
      navigate("/user/orders"); // ✅ Go to user orders page after placing order
    } catch (err) {
      console.error(err);
      alert("Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Checkout</h2>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <ul className="divide-y">
          {cart.items?.map((item, index) => (
            <li key={`${item.foodId}-${index}`} className="py-2 flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right space-y-1">
          <p>Total: ₹{total.toFixed(2)}</p>
          {discount > 0 && <p className="text-green-600">Discount: ₹{discount.toFixed(2)}</p>}
          <p className="font-bold text-lg">Final Amount: ₹{finalAmount}</p>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Apply Coupon</h3>
        {availableCoupons.length === 0 ? (
          <p className="text-sm text-gray-500">No available coupons.</p>
        ) : (
          <div className="space-y-2">
            {availableCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{coupon.code}</p>
                  <p className="text-sm text-gray-600">
                    {coupon.discount}% off | Min ₹{coupon.minOrderAmount}
                  </p>
                </div>
                <button
                  onClick={() => handleApplyCoupon(coupon.code)}
                  disabled={coupon.code === appliedCoupon}
                  className={`px-3 py-1 rounded text-white ${
                    coupon.code === appliedCoupon
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {coupon.code === appliedCoupon ? "Applied" : "Apply"}
                </button>
              </div>
            ))}
          </div>
        )}
        {couponMessage && (
          <p
            className={`mt-2 text-sm ${
              couponMessage.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {couponMessage}
          </p>
        )}
      </div>

      {/* Address & Payment */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter delivery address"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Cash on Delivery</option>
          <option>UPI</option>
          <option>Credit Card</option>
        </select>
      </div>

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full py-2 text-white font-semibold rounded ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
