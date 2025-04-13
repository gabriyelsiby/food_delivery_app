import express from "express";
import {
    registerRestaurant,
    restaurantLogin,
    restaurantProfile,
    updateRestaurantProfile,
    restaurantLogout,
    getRestaurants,
    updateRestaurantStatus // Add the new controller function here
} from "../controllers/restaurantControllers.js";

import { authRestaurant } from "../middlewares/authRestaurant.js";
import { authAdmin } from "../middlewares/authAdmin.js"; // Assuming you have an admin authentication middleware

const router = express.Router();

// Register a new restaurant
router.post("/register", registerRestaurant);

// Restaurant login
router.post("/login", restaurantLogin);

// Get restaurant profile (Only for logged-in restaurant owners)
router.get("/profile", authRestaurant, restaurantProfile);

// Edit restaurant profile
router.put("/update", authRestaurant, updateRestaurantProfile);

// ✅ Get all restaurants route (with optional filter by cuisine)
router.get("/", getRestaurants);

// Admin route to enable/disable a restaurant
router.put("/admin/:id/status", authAdmin, updateRestaurantStatus); // The new endpoint for enabling/disabling

// Logout restaurant
router.post("/logout", restaurantLogout);

export { router as restaurantRouter };
