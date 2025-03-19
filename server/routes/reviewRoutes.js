import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { addReview, deleteReview, getFoodReviews, getAverageRating } from "../controllers/reviewControllers.js";

const router = express.Router();

// ✅ Add a review for a food item
router.post("/add-review", authUser, addReview);

// ✅ Delete a review
router.delete("/delete-review/:reviewId", authUser, deleteReview);

// ✅ Get all reviews for a specific food item
router.get("/food-reviews/:foodId", getFoodReviews);

// ✅ Get average rating for a food item
router.get("/average-rating/:foodId", getAverageRating);

export { router as reviewRouter };
