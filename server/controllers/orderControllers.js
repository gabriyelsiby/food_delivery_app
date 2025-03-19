import { Order } from "../models/orderModel.js";
import { FoodItem } from "../models/foodItemModel.js";
import mongoose from "mongoose";

//  Place an Order (User Only)
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { restaurantId, items, discount = 0, address, paymentMethod } = req.body;

        //  Validate Required Fields
        if (!restaurantId || !items || items.length === 0 || !address || !paymentMethod) {
            return res.status(400).json({ message: "All fields are required (restaurantId, items, address, paymentMethod)" });
        }

        //  Fetch Food Item Prices & Calculate Total Price
        let totalPrice = 0;
        for (const item of items) {
            const foodItem = await FoodItem.findById(item.foodId);
            if (!foodItem) {
                return res.status(404).json({ message: `Food item with ID ${item.foodId} not found` });
            }
            totalPrice += foodItem.price * item.quantity; // Calculate Total
        }

        //  Ensure Discount Does Not Exceed Total Price
        const finalPrice = Math.max(totalPrice - discount, 0);

        //  Create and Save Order
        const newOrder = new Order({
            userId,
            restaurantId,
            items,
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

//  Get Order Details by Order ID
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID format" });
        }

        const order = await Order.findById(orderId)
            .populate("userId", "name email")
            .populate("restaurantId", "name address")
            .populate("items.foodId", "name price imageUrl")
            .populate("deliveryPartner", "name mobile vehicleType"); // ✅ Populated delivery partner details

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order details retrieved", data: order });

    } catch (error) {
        console.error("Get Order Details Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Get All Orders for a User
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ userId })
            .populate("restaurantId", "name address")
            .populate("items.foodId", "name price imageUrl");

        res.json({ message: "User orders retrieved", data: orders });

    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Order Status (Only Restaurant)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const restaurantId = req.user.id;

        //   Use correct order status values
        if (!["Pending", "Preparing", "Out for Delivery", "Delivered"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID format" });
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

//  Assign Order to a Delivery Partner (Admin)
export const assignOrderToDeliveryPartner = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryPartnerId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(deliveryPartnerId)) {
            return res.status(400).json({ message: "Invalid Order ID or Delivery Partner ID" });
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
        console.error("Assign Order Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Cancel an Order (Only User)
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID format" });
        }

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        order.status = "Cancelled";
        await order.save();

        res.json({ message: "Order cancelled successfully", data: order });

    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
