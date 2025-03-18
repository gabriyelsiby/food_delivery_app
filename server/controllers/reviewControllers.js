import { Review } from "../models/reviewModel.js";

// ✅ Add a Review for a Food Item
export const addReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        const userId = req.user.id;

        const newReview = new Review({ userId, foodId, rating, comment });
        await newReview.save();

        res.status(201).json({ message: "Review added successfully", data: newReview });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Delete a Review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found or not authorized" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Get All Reviews for a Food Item
export const getFoodReviews = async (req, res) => {
    try {
        const { foodId } = req.params;
        const reviews = await Review.find({ foodId }).populate("userId", "name").sort({ createdAt: -1 });

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this food item" });
        }

        res.status(200).json({ message: "Reviews retrieved", data: reviews });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Get Average Rating for a Food Item
export const getAverageRating = async (req, res) => {
    try {
        const { foodId } = req.params;
        const reviews = await Review.find({ foodId });

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this food item" });
        }

        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        res.status(200).json({ message: "Average rating calculated", data: averageRating });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
