import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        items: [{ 
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }, 
            quantity: Number, 
            price: Number 
        }],
        totalPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },  // ✅ New Field (Discount from coupon)
        finalPrice: { type: Number, required: true },  // ✅ New Field (Final price after discount)
        address: { type: String, required: true },
        status: { 
            type: String, 
            enum: ["Pending", "In Progress", "Preparing", "Out for Delivery", "Completed", "Cancelled"],  
            default: "Pending" 
        },  // ✅ Fixed Status Enum
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
