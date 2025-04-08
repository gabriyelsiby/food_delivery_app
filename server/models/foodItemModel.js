import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true, // Example: Pizza, Burger, etc.
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        imageUrl: {
            type: String,
            default: "https://via.placeholder.com/150",
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Ensure food name is unique within the same restaurant
foodItemSchema.index({ name: 1, restaurant: 1 }, { unique: true });

export const FoodItem = mongoose.model("FoodItem", foodItemSchema);
