// src/pages/user/Cart.jsx
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import Button from "../../components/ui/Button";
import axiosInstance from "../../config/axiosInstance"; // Import the Axios instance
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Cart = () => {
  const {
    cart,
    fetchCart,
    updateCart,
    removeFromCart,
    clearCart,
    loading,
    error,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchCart();
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get("coupon/all");
      setAvailableCoupons(response.data.data); // Set available coupons
    } catch (err) {
      console.error("Error fetching coupons", err);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code.");
      setCouponSuccess("");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "coupon/apply",
        { code: couponCode, orderId: cart.orderId }
      );
      setCouponSuccess(response.data.message);
      setCouponError("");
      fetchCart(); // Refresh cart data after applying coupon
    } catch (err) {
      setCouponError(err.response.data.message);
      setCouponSuccess("");
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const hasItems = cart?.items?.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>

      {!hasItems ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li
                key={item.foodId}
                className="border p-4 rounded shadow-md flex justify-between items-center"
              >
                <div className="flex gap-4">
                  <img
                    src={`http://localhost:5000/${item.imageUrl}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                    <div className="flex gap-2 items-center mt-2">
                      <button
                        className="bg-orange-500 text-white rounded-full w-8 h-8"
                        onClick={() =>
                          updateCart(item.foodId, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        className="bg-green-600 text-white rounded-full w-8 h-8"
                        onClick={() =>
                          updateCart(item.foodId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => removeFromCart(item.foodId)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Total: ₹{cart.totalPrice || 0}</h3>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={clearCart}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Clear Cart
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate("/checkout")} // Navigate to Checkout page
              >
                Checkout
              </Button>
            </div>
          </div>

          {/* Coupons section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Available Coupons</h3>
            <ul>
              {availableCoupons.length === 0 ? (
                <p>No active coupons available.</p>
              ) : (
                availableCoupons.map((coupon) => (
                  <li
                    key={coupon._id}
                    className="flex justify-between p-2 border mb-2 rounded"
                  >
                    <div>
                      <h4 className="font-semibold">{coupon.code}</h4>
                      <p>Discount: {coupon.discount}%</p>
                      <p>Min Order: ₹{coupon.minOrderAmount}</p>
                      <p>
                        Expires on: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setCouponCode(coupon.code)} // Set coupon code to apply
                    >
                      Apply
                    </Button>
                  </li>
                ))
              )}
            </ul>
            {couponError && <p className="text-red-500">{couponError}</p>}
            {couponSuccess && <p className="text-green-500">{couponSuccess}</p>}
          </div>

          {/* Apply coupon */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Apply Coupon</h3>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="p-2 border rounded"
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleApplyCoupon}
              >
                Apply Coupon
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
