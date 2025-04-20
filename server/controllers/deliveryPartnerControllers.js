import { DeliveryPartner } from "../models/deliveryPartnerModel.js";
import { Order } from "../models/orderModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import mongoose from "mongoose";

//  Register a Delivery Partner
export const registerDeliveryPartner = async (req, res) => {
    try {
        const { name, email, password, mobile, vehicleType } = req.body;

        if (!name || !email || !password || !mobile || !vehicleType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingPartner = await DeliveryPartner.findOne({ email });
        if (existingPartner) {
            return res.status(400).json({ message: "Delivery partner already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newPartner = new DeliveryPartner({
            name,
            email,
            password: hashedPassword,
            mobile,
            vehicleType,
        });

        await newPartner.save();
        const token = generateToken(newPartner._id, "deliveryPartner");

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });

        res.status(201).json({ message: "Delivery partner registered successfully", data: newPartner });

    } catch (error) {
        console.error("Register Delivery Partner Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Login a Delivery Partner
export const loginDeliveryPartner = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const partner = await DeliveryPartner.findOne({ email });
        if (!partner) {
            return res.status(404).json({ message: "Delivery partner not found" });
        }

        const passwordMatch = bcrypt.compareSync(password, partner.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(partner._id, "deliveryPartner");

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });

        res.json({ message: "Login successful", data: { name: partner.name, email: partner.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Get Delivery Partner Profile
export const getDeliveryPartnerProfile = async (req, res) => {
    try {
        const partnerId = req.user.id;
        const partner = await DeliveryPartner.findById(partnerId).select("-password");

        if (!partner) {
            return res.status(404).json({ message: "Delivery partner not found" });
        }

        res.json({ message: "Profile retrieved", data: partner });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get Orders Assigned to Delivery Partner (Delivery Partner Only)
export const getAssignedOrders = async (req, res) => {
    try {
        const deliveryPartnerId = req.user?.id;

        if (!mongoose.Types.ObjectId.isValid(deliveryPartnerId)) {
            return res.status(400).json({ message: "Invalid delivery partner ID" });
        }

        const orders = await Order.find({ deliveryPartner: deliveryPartnerId })
            .populate("userId", "name email phone address")  // <-- Added address here
            .populate("restaurantId", "name address")
            .populate("items.foodId", "name price imageUrl");

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error("❌ Get Assigned Orders Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Order Delivery Status
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const validStatuses = ["Out for Delivery", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;

        await order.save({ validateModifiedOnly: true });

        res.json({ message: `Order status updated to '${status}'`, data: order });
    } catch (error) {
        console.error("❌ Update Delivery Status Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Assign Order to a Delivery Partner (Admin Only)
export const assignOrder = async (req, res) => {
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

        res.json({ data: order, message: "Order assigned to delivery partner" });
    } catch (error) {
        console.error("Assign Order Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Logout a Delivery Partner
export const logoutDeliveryPartner = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
