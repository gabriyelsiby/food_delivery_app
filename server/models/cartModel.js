import mongoose from "mongoose";
import { FoodItem } from "./foodItemModel.js";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                foodId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "FoodItem",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

// Updated: Calculate Total Price with latest food item prices
cartSchema.methods.calculateTotalPrice = async function () {
    let total = 0;
    for (const item of this.items) {
        const food = await FoodItem.findById(item.foodId);
        if (food) {
            item.price = food.price;
            total += food.price * item.quantity;
        }
    }
    this.totalPrice = total;
};

export const Cart = mongoose.model("Cart", cartSchema);
