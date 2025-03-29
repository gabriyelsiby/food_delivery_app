// src/pages/RestaurantDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const RestaurantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch the food items for the logged-in restaurant
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/food/food-list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // Optionally filter foods based on the restaurant ID from user details.
        setFoods(response.data);
        setLoadingFoods(false);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
        setLoadingFoods(false);
      });
  }, []);

  // Fetch orders for this restaurant (assuming a dedicated endpoint exists)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/order/restaurant-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setOrders(response.data);
        setLoadingOrders(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoadingOrders(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Dashboard</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Food Items</h2>
        {loadingFoods ? (
          <p>Loading foods...</p>
        ) : foods.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {foods.map((food) => (
              <div key={food._id} className="border p-4 rounded">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-32 object-cover rounded"
                />
                <h3 className="font-bold mt-2">{food.name}</h3>
                <p>${food.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No food items found. Add a new food item.</p>
        )}
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
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
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </section>
    </div>
  );
};

export default RestaurantDashboard;
