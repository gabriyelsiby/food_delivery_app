import mongoose from "mongoose";
import { Order } from "../models/orderModel.js";
import { FoodItem } from "../models/foodItemModel.js";

// Place an Order (User Only)
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { restaurantId, items, discount = 0, address, paymentMethod } = req.body;

        if (!restaurantId || !items || items.length === 0 || !address || !paymentMethod) {
            return res.status(400).json({
                message: "All fields are required (restaurantId, items, address, paymentMethod)",
            });
        }

        let totalPrice = 0;
        const enrichedItems = [];

        for (const item of items) {
            const foodItem = await FoodItem.findById(item.foodId);
            if (!foodItem) {
                return res.status(404).json({ message: `Food item with ID ${item.foodId} not found` });
            }

            const price = foodItem.price;
            totalPrice += price * item.quantity;

            enrichedItems.push({
                foodId: item.foodId,
                quantity: item.quantity,
                price: price,
            });
        }

        const finalPrice = Math.max(totalPrice - discount, 0);

        const newOrder = new Order({
            userId,
            restaurantId,
            items: enrichedItems,
            totalPrice,
            discount,
            finalPrice,
            address,
            paymentMethod,
            status: "Pending",
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", data: newOrder });

    } catch (error) {
        console.error("Place Order Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Order Details by ID
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findById(orderId)
            .populate("userId", "name email")
            .populate("restaurantId", "name address")
            .populate("items.foodId", "name price imageUrl")
            .populate("deliveryPartner", "name mobile vehicleType");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order details retrieved", data: order });

    } catch (error) {
        console.error("Get Order Details Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get All Orders for Logged-in User
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate("restaurantId", "name address")
            .populate("items.foodId", "name price imageUrl");

        res.json({ message: "User orders retrieved", data: orders });

    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Order Status (Restaurant Only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const restaurantId = req.user.id;

        const validStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findOne({ _id: orderId, restaurantId });
        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        order.status = status;
        await order.save();

        res.json({ message: `Order status updated to '${status}'`, data: order });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Assign Delivery Partner (Admin Only)
export const assignOrderToDeliveryPartner = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryPartnerId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(deliveryPartnerId)) {
            return res.status(400).json({ message: "Invalid order ID or delivery partner ID" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.deliveryPartner = deliveryPartnerId;
        order.status = "Out for Delivery";
        await order.save();

        res.json({ message: "Order assigned to delivery partner", data: order });

    } catch (error) {
        console.error("Assign Delivery Partner Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Cancel Order (User Only)
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        if (order.status === "Delivered" || order.status === "Cancelled") {
            return res.status(400).json({ message: `Cannot cancel order. Current status: ${order.status}` });
        }

        order.status = "Cancelled";
        await order.save();

        res.json({ message: "Order cancelled successfully", data: order });

    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
