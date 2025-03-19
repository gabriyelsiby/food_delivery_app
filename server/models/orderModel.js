import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner", default: null }, // ✅ New Field
        items: [{ foodId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }, quantity: Number, price: Number }],
        totalPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        finalPrice: { type: Number, required: true },
        address: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Preparing", "Out for Delivery", "Delivered"], default: "Pending" },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
