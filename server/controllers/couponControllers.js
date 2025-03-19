import { Coupon } from "../models/couponModel.js";
import { Order } from "../models/orderModel.js";

//  Apply Coupon to an Order
export const applyCoupon = async (req, res) => {
    try {
        const { code, orderId } = req.body;

        //  Check if coupon exists and is active
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) {
            return res.status(400).json({ message: "Invalid or expired coupon" });
        }

        // Fetch order details
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        //  Ensure order meets the minimum amount requirement
        if (order.totalPrice < coupon.minOrderAmount) {
            return res.status(400).json({ 
                message: `Minimum order amount should be ₹${coupon.minOrderAmount}` 
            });
        }

        //  Calculate Discount
        let discountAmount = (order.totalPrice * coupon.discount) / 100;
        discountAmount = Math.min(discountAmount, coupon.maxDiscount); // Apply max discount limit

        // Update order with discounted price
        order.discount = discountAmount;
        order.finalPrice = order.totalPrice - discountAmount;
        await order.save();

        res.json({
            message: "Coupon applied successfully",
            discountAmount,
            finalPrice: order.finalPrice,
        });
    } catch (error) {
        console.error("Apply Coupon Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Create a New Coupon (Admin Only)
export const createCoupon = async (req, res) => {
    try {
        const { code, discount, maxDiscount, minOrderAmount, expiryDate } = req.body;

        //  Check if coupon already exists
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        //  Validate discount values
        if (discount < 1 || discount > 100) {
            return res.status(400).json({ message: "Discount should be between 1% and 100%" });
        }

        //  Validate expiry date
        if (new Date(expiryDate) < new Date()) {
            return res.status(400).json({ message: "Expiry date must be in the future" });
        }

        //  Create new coupon
        const newCoupon = new Coupon({
            code,
            discount,
            maxDiscount,
            minOrderAmount,
            expiryDate,
        });

        await newCoupon.save();

        res.status(201).json({ message: "Coupon created successfully", data: newCoupon });
    } catch (error) {
        console.error("Create Coupon Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Get All Coupons (Admin Only)
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({ message: "Coupons retrieved successfully", data: coupons });
    } catch (error) {
        console.error("Get Coupons Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Delete a Coupon (Admin Only)
export const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;

        const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
        if (!deletedCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Delete Coupon Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
