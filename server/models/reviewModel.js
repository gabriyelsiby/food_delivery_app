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

// ➕ Static method to calculate average rating for a food item
reviewSchema.statics.calculateAverageRating = async function (foodId) {
    const result = await this.aggregate([
        { $match: { foodId: new mongoose.Types.ObjectId(foodId) } },
        { $group: { _id: "$foodId", avgRating: { $avg: "$rating" } } }
    ]);

    return result.length > 0 ? result[0].avgRating.toFixed(1) : "No reviews yet";
};

// ✅ Add compound index to prevent duplicate reviews from the same user
reviewSchema.index({ userId: 1, foodId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
