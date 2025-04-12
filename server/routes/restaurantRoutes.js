import express from "express";
import {
    registerRestaurant,
    restaurantLogin,
    restaurantProfile,
    updateRestaurantProfile,
    restaurantLogout,
    getRestaurants
} from "../controllers/restaurantControllers.js";

import { authRestaurant } from "../middlewares/authRestaurant.js";

const router = express.Router();

// Register a new restaurant
router.post("/register", registerRestaurant);

// Restaurant login
router.post("/login", restaurantLogin);

// Get restaurant profile (Only for logged-in restaurant owners)
router.get("/profile", authRestaurant, restaurantProfile);

// Edit restaurant profile
router.put("/update", authRestaurant, updateRestaurantProfile);

// ✅ FIXED: Clean get all restaurants route
router.get("/", getRestaurants);

// Logout restaurant
router.post("/logout", restaurantLogout);

export { router as restaurantRouter };
