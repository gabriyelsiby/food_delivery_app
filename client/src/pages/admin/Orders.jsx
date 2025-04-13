import { useEffect, useState } from "react";
import api from "../../config/axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [assigning, setAssigning] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch orders!");
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await api.get("/orders/admin/delivery-partners");
      setPartners(res.data.data);
    } catch (error) {
      toast.error("Failed to load delivery partners!");
    }
  };

  const assignPartner = async (orderId, deliveryPartnerId) => {
    if (!deliveryPartnerId) return toast.error("Select a delivery partner first!");

    try {
      setAssigning(prev => ({ ...prev, [orderId]: true }));
      await api.put(`/orders/${orderId}/assign`, { deliveryPartnerId });
      toast.success("Assigned successfully!");
      fetchOrders(); // Refresh
    } catch (error) {
      toast.error(error.response?.data?.message || "Assignment failed!");
    } finally {
      setAssigning(prev => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🧾 Order Management</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <div key={order._id} className="rounded-2xl shadow p-4 bg-white space-y-2 border">
              <div className="text-lg font-semibold">Order #{order._id.slice(-6)}</div>
              <div>User: {order.userId?.name}</div>
              <div>Restaurant: {order.restaurantId?.name}</div>
              <div>Status: <span className="font-medium">{order.status}</span></div>

              <div className="border-t pt-2 space-y-1">
                <p className="font-medium">Items:</p>
                <ul className="list-disc list-inside text-sm">
                  {order.items.map((item, index) => (
                    <li key={index}>{item.foodId?.name} × {item.quantity}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 space-y-1">
                <p className="font-medium">Assign Delivery Partner:</p>
                <select
                  className="w-full border rounded p-2"
                  defaultValue={order.deliveryPartner?._id || ""}
                  onChange={e => assignPartner(order._id, e.target.value)}
                  disabled={assigning[order._id]}
                >
                  <option value="">Select Partner</option>
                  {partners.map(partner => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name} ({partner.vehicleType})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => assignPartner(order._id, order.deliveryPartner?._id)}
                disabled={!order.deliveryPartner?._id || assigning[order._id]}
                className={`w-full mt-2 py-2 rounded text-white 
                  ${assigning[order._id] ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {assigning[order._id] ? "Assigning..." : "Assign Partner"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
