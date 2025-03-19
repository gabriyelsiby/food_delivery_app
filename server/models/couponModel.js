import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, trim: true },
        discount: { type: Number, required: true, min: 1, max: 100 }, // Discount percentage (1-100)
        maxDiscount: { type: Number, default: 50 }, // Maximum discount amount
        minOrderAmount: { type: Number, default: 0 }, // Minimum order amount required
        expiryDate: { type: Date, required: true }, // Expiry date for the coupon
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);



// ✅Auto-disable expired coupons before saving
couponSchema.pre("save", function (next) {
    if (this.expiryDate < new Date()) {
        this.isActive = false;
    }
    next();
});

//  Auto-disable expired coupons before updating
couponSchema.pre("findOneAndUpdate", function (next) {
    if (this._update.expiryDate && new Date(this._update.expiryDate) < new Date()) {
        this._update.isActive = false;
    }
    next();
});

export const Coupon = mongoose.model("Coupon", couponSchema);
