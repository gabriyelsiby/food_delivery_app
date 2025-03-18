import { Order } from "../models/orderModel.js";

// Get Assigned Orders for a Delivery Partner
export const getAssignedOrders = async (req, res) => {
    try {
        const deliveryPartnerId = req.user.id;
        const orders = await Order.find({ deliveryPartner: deliveryPartnerId });

        if (!orders.length) {
            return res.status(404).json({ message: "No assigned orders found" });
        }

        res.json({ data: orders, message: "Assigned orders fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Update Order Delivery Status
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ["Out for Delivery", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid delivery status" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ data: order, message: `Order marked as '${status}'` });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Assign Order to a Delivery Partner (Admin or Automated System)
export const assignOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryPartnerId } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { deliveryPartner: deliveryPartnerId, status: "Out for Delivery" }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ data: order, message: "Order assigned to delivery partner" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
