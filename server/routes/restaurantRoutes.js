import express from "express";
import { 
    registerRestaurant, 
    restaurantLogin, 
    restaurantProfile, 
    updateRestaurantProfile,  
    restaurantLogout          
} from "../controllers/restaurantControllers.js";

import { authRestaurant } from "../middlewares/authRestaurant.js";

const router = express.Router();

// Register a new restaurant
router.post("/register", registerRestaurant);

// Restaurant login
router.post("/login", restaurantLogin);

// Get restaurant profile (Only for logged-in restaurant owners)
router.get("/profile", authRestaurant, restaurantProfile);

// ✅ Edit restaurant profile (Only for logged-in restaurant owners)
router.put("/update", authRestaurant, updateRestaurantProfile);

// ✅ Logout restaurant
router.get("/logout", restaurantLogout);

export { router as restaurantRouter };
