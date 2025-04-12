import { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
