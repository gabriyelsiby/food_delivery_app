import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders/restaurant");
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Restaurant Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-xl shadow-sm bg-white">
              <p><span className="font-semibold">User:</span> {order.userId?.name} ({order.userId?.email})</p>
              <p><span className="font-semibold">Address:</span> {order.address}</p>
              <p><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
              <p><span className="font-semibold">Status:</span> {order.status}</p>
              <p><span className="font-semibold">Final Price:</span> ₹{order.finalPrice}</p>

              <div className="mt-2">
                <p className="font-semibold">Items:</p>
                <ul className="list-disc list-inside">
                  {order.items.map((item) => (
                    <li key={item.foodId._id}>
                      {item.foodId.name} x {item.quantity} – ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
