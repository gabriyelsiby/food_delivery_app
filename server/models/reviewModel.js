import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Review = mongoose.model("Review", reviewSchema);
