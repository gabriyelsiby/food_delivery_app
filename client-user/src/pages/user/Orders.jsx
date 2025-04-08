import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";  // Axios instance for API requests

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("orders/user/all"); // Fetch orders from backend
      setOrders(response.data.data); // Assuming 'data' holds the orders array
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/order-details/${orderId}`); // Redirect to order summary page
  };

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                </div>
                <div>
                  <p className="font-medium">Total: ₹{order.totalPrice}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Items:</h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-end">
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
