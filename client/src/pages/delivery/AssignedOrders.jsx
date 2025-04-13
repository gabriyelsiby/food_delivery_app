// src/pages/delivery/AssignedOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "../../config/axios";

const AssignedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch assigned orders
        const fetchAssignedOrders = async () => {
            try {
                const response = await axios.get("/delivery/assigned-orders", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token is stored in localStorage
                    },
                });
                setOrders(response.data.data);
            } catch (err) {
                setError("Failed to load assigned orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedOrders();
    }, []);

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await axios.put(`/delivery/update-order-status/${orderId}`, { status }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert(`Order marked as '${status}'`);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status } : order
                )
            );
        } catch (err) {
            alert("Failed to update order status.");
        }
    };

    // Render loading or error state
    if (loading) return <div className="text-center mt-4">Loading...</div>;
    if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Assigned Orders</h2>
            {orders.length === 0 ? (
                <p className="text-center text-gray-600">No assigned orders at the moment.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                                <td className="border border-gray-300 px-4 py-2">{order.customerName}</td>
                                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {order.status !== "Delivered" && (
                                        <button
                                            onClick={() => handleUpdateStatus(order._id, "Delivered")}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AssignedOrders;
