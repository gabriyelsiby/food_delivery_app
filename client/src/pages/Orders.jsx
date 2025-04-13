import { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/user/all`,
          {
            withCredentials: true,
          }
        );
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Cancel Order
  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/orders/${orderId}`,
        {},
        {
          withCredentials: true,
        }
      );
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: "Cancelled" } : order
      ));
    } catch (err) {
      console.error("Error canceling order:", err);
      setError("Failed to cancel the order.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4">📦 Your Orders</h2>
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4">📦 Your Orders</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4">📦 Your Orders</h2>
        <p className="text-gray-600">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">📦 Your Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-2xl p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold">
                Order #{order._id.slice(-6)}
              </div>
              <span
                className={`text-sm font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Cancelled"
                    ? "text-red-500"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="space-y-1 text-sm">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.foodId?.name || "Food Item"}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right font-semibold">
              ₹ {order.finalPrice}
            </div>

            {/* Cancel Button */}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button
                onClick={() => cancelOrder(order._id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
