import { Review } from "../models/reviewModel.js";

//  Add or Update a Review for a Food Item
export const addReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!foodId || !rating) {
            return res.status(400).json({ message: "Food ID and rating are required" });
        }

        //  Check if the user has already reviewed this food item
        const existingReview = await Review.findOne({ userId, foodId });

        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this food item" });
        }

        //  Create new review
        const newReview = new Review({ userId, foodId, rating, comment });
        await newReview.save();

        res.status(201).json({ message: "Review added successfully", data: newReview });
    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Delete a Review (Only the user who created it)
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
        console.error("Delete Review Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Get All Reviews for a Food Item
export const getFoodReviews = async (req, res) => {
    try {
        const { foodId } = req.params;

        const reviews = await Review.find({ foodId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this food item" });
        }

        res.status(200).json({ message: "Reviews retrieved successfully", data: reviews });
    } catch (error) {
        console.error("Get Food Reviews Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Get Average Rating for a Food Item
export const getAverageRating = async (req, res) => {
    try {
        const { foodId } = req.params;

        const averageRating = await Review.calculateAverageRating(foodId);

        if (averageRating === "No reviews yet") {
            return res.status(404).json({ message: "No reviews found for this food item" });
        }

        res.status(200).json({ message: "Average rating retrieved", data: averageRating });
    } catch (error) {
        console.error("Get Average Rating Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
