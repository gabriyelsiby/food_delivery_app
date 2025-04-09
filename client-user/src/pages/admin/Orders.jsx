import React, { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/admin/all");
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchDeliveryPartners = async () => {
    try {
      const res = await axios.get("/orders/admin/delivery-partners");
      setDeliveryPartners(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch delivery partners");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchOrders();
      await fetchDeliveryPartners();
      setLoading(false);
    };
    loadData();
  }, []);

  const assignDeliveryPartner = async (orderId, partnerId) => {
    try {
      await axios.put(`/orders/${orderId}/assign`, { deliveryPartnerId: partnerId });
      toast.success("Assigned successfully");
      fetchOrders(); // Refresh orders after assignment
    } catch (error) {
      toast.error(error.response?.data?.message || "Assignment failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <table className="min-w-full text-sm border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Restaurant</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Delivery Partner</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{order.userId?.name || "N/A"}</td>
                <td className="p-2 border">{order.restaurantId?.name || "N/A"}</td>
                <td className="p-2 border">₹{order.finalPrice}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-2 border">{order.paymentMethod}</td>
                <td className="p-2 border">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={order.deliveryPartnerId?._id || ""}
                    onChange={(e) =>
                      assignDeliveryPartner(order._id, e.target.value)
                    }
                  >
                    <option value="">-- Select --</option>
                    {deliveryPartners.map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
