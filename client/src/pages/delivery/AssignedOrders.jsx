import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignedOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch assigned orders
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/delivery/orders`);
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Assigned Orders</h2>
      <div className="mt-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="border p-4 mb-4 rounded-md">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Restaurant:</strong> {order.restaurantName}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          ))
        ) : (
          <p>No assigned orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default AssignedOrders;
