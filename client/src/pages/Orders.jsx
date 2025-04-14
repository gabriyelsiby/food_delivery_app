import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // MongoDB ObjectId Validator
  const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders/user/all");
        setOrders(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!isValidObjectId(orderId)) {
      alert("Invalid order ID!");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert("Order canceled successfully.");
    } catch (err) {
      console.error("Cancel Order Error:", err);
      alert(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg">{error}</div>
    );
  }

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="shadow-md rounded-2xl border p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Order ID: {order._id}</h2>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Restaurant: {order.restaurantId?.name} ({order.restaurantId?.address})
            </p>

            <div className="space-y-1">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.foodId?.name} x {item.quantity}</span>
                  <span>₹{item.foodId?.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <p className="font-medium">Total: ₹{order.totalPrice}</p>

            <p
              className={`text-sm font-semibold ${
                order.status === "Pending"
                  ? "text-yellow-500"
                  : order.status === "Preparing"
                  ? "text-orange-500"
                  : order.status === "Out for Delivery"
                  ? "text-blue-600"
                  : order.status === "Delivered"
                  ? "text-green-600"
                  : order.status === "Cancelled"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              Status: {order.status}
            </p>

            {/* Display Cancel Button only for Pending or Preparing */}
            {["Pending", "Preparing"].includes(order.status) && (
              <button
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleCancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}

            {/* Display Add Review Buttons for Delivered Orders */}
            {order.status === "Delivered" && (
              <div className="mt-2 space-y-1">
                {order.items.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => navigate(`/reviews/${item.foodId?._id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full text-left"
                  >
                    Review {item.foodId?.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
