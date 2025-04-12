import { Coupon } from "../models/couponModel.js";

// ✅ Apply Coupon Based on Total Price (No orderId needed)
export const applyCoupon = async (req, res) => {
    try {
        const { code, totalPrice } = req.body;

        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) {
            return res.status(400).json({ message: "Invalid or expired coupon" });
        }

        // Check if coupon has expired
        if (new Date(coupon.expiryDate) < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: "This coupon has expired" });
        }

        if (totalPrice < coupon.minOrderAmount) {
            return res.status(400).json({ 
                message: `Minimum order amount should be ₹${coupon.minOrderAmount}` 
            });
        }

        let discountAmount = (totalPrice * coupon.discount) / 100;
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        const finalPrice = totalPrice - discountAmount;

        res.json({
            message: "Coupon applied successfully",
            discountAmount,
            finalPrice
        });
    } catch (error) {
        console.error("Apply Coupon Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Create a New Coupon (Admin Only)
export const createCoupon = async (req, res) => {
    try {
        const { code, discount, maxDiscount, minOrderAmount, expiryDate } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        if (discount < 1 || discount > 100) {
            return res.status(400).json({ message: "Discount should be between 1% and 100%" });
        }

        if (new Date(expiryDate) < new Date()) {
            return res.status(400).json({ message: "Expiry date must be in the future" });
        }

        const newCoupon = new Coupon({
            code,
            discount,
            maxDiscount,
            minOrderAmount,
            expiryDate,
            isActive: true
        });

        await newCoupon.save();

        res.status(201).json({ message: "Coupon created successfully", data: newCoupon });
    } catch (error) {
        console.error("Create Coupon Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get Available Active Coupons (User and Admin)
export const getAvailableCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const coupons = await Coupon.find({ isActive: true })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Coupon.countDocuments({ isActive: true });

        res.json({
            message: "Active coupons retrieved successfully",
            data: coupons,
            pagination: { total, page: parseInt(page), limit: parseInt(limit) }
        });
    } catch (error) {
        console.error("Get Available Coupons Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Delete a Coupon (Admin Only)
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

// ✅ Toggle Coupon Active/Inactive (Admin Only)
export const toggleCouponStatus = async (req, res) => {
    try {
        const { couponId } = req.params;

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json({
            message: `Coupon is now ${coupon.isActive ? "active" : "inactive"}`,
            data: coupon
        });
    } catch (error) {
        console.error("Toggle Coupon Status Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
