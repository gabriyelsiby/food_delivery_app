import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { addReview, deleteReview, getFoodReviews, getAverageRating } from "../controllers/reviewControllers.js";

const router = express.Router();


router.post("/add-review", authUser, addReview);


router.delete("/delete-review/:reviewId", authUser, deleteReview);


router.get("/food-reviews/:foodId", getFoodReviews);


router.get("/average-rating/:foodId", getAverageRating);

export { router as reviewRouter };
