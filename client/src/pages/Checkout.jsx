import { useState, useEffect } from "react";
import useCartStore from "../store/cartStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items, totalPrice, clearCart, loadCartFromStorage } = useCartStore();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState(""); // State for coupon code
  const [discount, setDiscount] = useState(0); // State for discount
  const [finalPrice, setFinalPrice] = useState(totalPrice); // State for final price
  const [availableCoupons, setAvailableCoupons] = useState([]); // State for available coupons
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load cart data from local storage on component mount
  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  // Update final price whenever total price or discount changes
  useEffect(() => {
    setFinalPrice(totalPrice - discount);
  }, [totalPrice, discount]);

  // Fetch available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/coupon/available`, {
          withCredentials: true,
        });
        setAvailableCoupons(res.data.data || []);
      } catch (error) {
        console.error("Fetch Coupons Error:", error);
        toast.error("Failed to load available coupons.");
      }
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (code) => {
    const couponToApply = code || couponCode; // Use provided code or input field value
    if (!couponToApply) {
      return toast.error("Please enter a coupon code");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/coupon/apply`, // Ensure this matches the backend route
        { code: couponToApply, totalPrice }, // Send totalPrice instead of orderId
        { withCredentials: true }
      );

      const { discountAmount, finalPrice } = res.data;
      setDiscount(discountAmount);
      setFinalPrice(finalPrice);
      setCouponCode(couponToApply); // Store applied coupon code
      toast.success("Coupon applied successfully!");
    } catch (error) {
      console.error("Apply Coupon Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to apply coupon. Please try again."
      );
    }
  };

  const handleCheckout = async () => {
    if (!address || !paymentMethod) {
      return toast.error("Please provide address and payment method");
    }

    if (items.length === 0) {
      return toast.error("Your cart is empty");
    }

    // Extract restaurantId from the first item and check if it exists
    const restaurantId = items[0]?.restaurantId;

    // Log cart items and restaurantIds for debugging
    console.log("Cart Items:", items);
    console.log("Restaurant IDs in Cart:", items.map(item => item.restaurantId));

    // Check if all items have the same restaurantId
    const allSameRestaurant = items.every(item => item.restaurantId === restaurantId);

    if (!restaurantId || !allSameRestaurant) {
      console.error("Validation Failed: Items from multiple restaurants detected.");
      return toast.error("All items in the cart must belong to the same restaurant.");
    }

    setLoading(true);
    try {
      // Prepare the order data
      const orderData = {
        restaurantId, // The first item's restaurantId (assuming all items belong to the same restaurant)
        items: items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
        address,
        paymentMethod,
        discount,
      };

      // Log the orderData for debugging
      console.log("Order Data:", orderData);

      // Make the API request to place the order
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderData,
        {
          withCredentials: true,
        }
      );

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      if (error.response?.status === 401) {
        toast.error("You are not authorized. Please log in and try again.");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Checkout failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="p-6 text-center text-gray-500">Your cart is empty</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-rose-600">Checkout</h2>

      <div className="space-y-2">
        <label className="block font-medium">Delivery Address</label>
        <textarea
          className="w-full p-2 border rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Payment Method</label>
        <select
          className="w-full p-2 border rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="online">Online Payment (Coming soon)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Coupon Code</label>
        <div className="flex space-x-2">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <button
            onClick={() => handleApplyCoupon()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Available Coupons</label>
        <div className="space-y-2">
          {availableCoupons.length === 0 ? (
            <p className="text-gray-500">No coupons available</p>
          ) : (
            availableCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{coupon.code}</p>
                  <p className="text-sm text-gray-500">
                    {coupon.discount}% off, up to ₹{coupon.maxDiscount} | Min Order: ₹
                    {coupon.minOrderAmount}
                  </p>
                </div>
                <button
                  onClick={() => handleApplyCoupon(coupon.code)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {discount > 0 && (
        <>
          <div className="text-right font-bold text-xl text-green-600">
            Discount: -₹{discount}
          </div>
          <div className="text-right font-bold text-xl text-rose-600">
            Final Price to Pay: ₹{finalPrice}
          </div>
          <div className="text-right mt-2">
            <button
              onClick={() => {
                setDiscount(0);
                setFinalPrice(totalPrice);
                setCouponCode("");
                toast.info("Coupon removed");
              }}
              className="bg-gray-400 text-white px-4 py-1 rounded"
            >
              Remove Coupon
            </button>
          </div>
        </>
      )}

      {discount === 0 && (
        <div className="text-right font-bold text-xl text-rose-600">
          Final Price to Pay: ₹{finalPrice}
        </div>
      )}

      <div className="text-right">
        <button
          onClick={handleCheckout}
          className={`bg-rose-600 text-white px-6 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
