// src/pages/DeliveryDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/delivery/assigned-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assigned orders:", err);
        setLoading(false);
      });
  }, [token]);

  const handleStatusUpdate = (orderId, newStatus) => {
    axios
      .put(
        `http://localhost:5000/api/delivery/update-order-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        // Update the order status locally after successful update.
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((err) => {
        console.error("Error updating order status:", err);
      });
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>
      {orders.length === 0 ? (
        <p>No assigned orders.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 rounded mb-4">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ${order.total.toFixed(2)}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="mt-2">
              <button
                onClick={() => handleStatusUpdate(order._id, "Out for Delivery")}
                className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Mark Out for Delivery
              </button>
              <button
                onClick={() => handleStatusUpdate(order._id, "Delivered")}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Mark Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryDashboard;
