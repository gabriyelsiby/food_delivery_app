import { Coupon } from "../models/couponModel.js";
import { Order } from "../models/orderModel.js";

// Apply Coupon to an Order
export const applyCoupon = async (req, res) => {
    try {
        const { code, orderId } = req.body;

        // Check if coupon exists and is active
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) {
            return res.status(400).json({ message: "Invalid or expired coupon" });
        }

        // Fetch order details
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if order meets the minimum amount requirement
        if (order.totalPrice < coupon.minOrderAmount) {
            return res.status(400).json({ message: `Minimum order amount should be ${coupon.minOrderAmount}` });
        }

        // Calculate discount
        let discountAmount = (order.totalPrice * coupon.discount) / 100;
        discountAmount = Math.min(discountAmount, coupon.maxDiscount); // Apply max discount limit

        // Update order with discounted price
        order.discount = discountAmount;
        order.finalPrice = order.totalPrice - discountAmount;
        await order.save();

        res.json({ message: "Coupon applied successfully", discountAmount, finalPrice: order.finalPrice });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a New Coupon (Admin Only)
export const createCoupon = async (req, res) => {
    try {
        const { code, discount, maxDiscount, minOrderAmount, expiryDate } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const newCoupon = new Coupon({ code, discount, maxDiscount, minOrderAmount, expiryDate });
        await newCoupon.save();

        res.json({ message: "Coupon created successfully", data: newCoupon });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Coupons (Admin Only)
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({ data: coupons });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
