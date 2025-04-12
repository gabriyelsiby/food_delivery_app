import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/Button";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/orders/admin/all");
      console.log("Fetched Orders:", data); // Log the response data to check the structure
      setOrders(data.data || []); // Ensure that 'data.data' is correct or adjust to 'data.orders' or similar
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]); // Reset in case of error
    }
  };

  // Fetch delivery partners from the backend
  const fetchDeliveryPartners = async () => {
    try {
      const { data } = await axios.get("/orders/admin/delivery-partners");
      console.log("Fetched Delivery Partners:", data); // Log the response data to check the structure
      setDeliveryPartners(data.data || []); // Ensure that 'data.data' is correct or adjust if needed
    } catch (error) {
      console.error("Failed to fetch delivery partners:", error);
      setDeliveryPartners([]); // Reset in case of error
    }
  };

  // Handle assigning a delivery partner to an order
  const handleAssign = async (orderId) => {
    if (!selectedPartner[orderId]) {
      return alert("Please select a delivery partner.");
    }
    try {
      await axios.put(`/orders/${orderId}/assign`, {
        deliveryPartnerId: selectedPartner[orderId],
      });
      alert("Order assigned successfully!");
      fetchOrders(); // Re-fetch orders after assignment
    } catch (error) {
      console.error("Failed to assign delivery partner:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      {/* Order Management Section */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center">No orders available</div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-md shadow-md flex flex-col space-y-4"
            >
              <div>
                <span className="font-semibold">Order ID: </span>
                {order._id}
              </div>
              <div>
                <span className="font-semibold">Restaurant: </span>
                {order.restaurantId?.name || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Status: </span>
                {order.status}
              </div>

              {/* Delivery Partner Selection */}
              <div>
                <span className="font-semibold">Assign Delivery Partner: </span>
                <select
                  value={selectedPartner[order._id] || ""}
                  onChange={(e) =>
                    setSelectedPartner((prev) => ({
                      ...prev,
                      [order._id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Partner</option>
                  {deliveryPartners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name} - {partner.vehicleType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Button */}
              <Button onClick={() => handleAssign(order._id)}>
                Assign Delivery Partner
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
