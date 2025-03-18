import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        discount: { type: Number, required: true }, // Discount percentage
        maxDiscount: { type: Number, default: 50 }, // Maximum discount amount
        minOrderAmount: { type: Number, default: 0 }, // Minimum order amount required
        expiryDate: { type: Date, required: true }, // Expiry date for the coupon
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
