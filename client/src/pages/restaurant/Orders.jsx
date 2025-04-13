import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import RestaurantNavbar from "../../components/RestaurantNavbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const validStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders/restaurant/orders"); // Correct endpoint
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      alert(response.data.message);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div>
      <RestaurantNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="mt-4 space-y-4">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="p-4 border rounded">
                <h2 className="text-lg font-medium">Order #{order._id}</h2>
                <p><strong>Status:</strong> {order.status}</p>
                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer?.name || order.customer || "Unknown"}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  ${typeof order.total === "number" ? order.total.toFixed(2) : "0.00"}
                </p>

                {order.items && order.items.length > 0 && (
                  <div className="mt-2">
                    <strong>Items:</strong>
                    <ul className="list-disc pl-5">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x {item.quantity} - ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-2">
                  <label className="block text-sm font-medium">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {validStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
