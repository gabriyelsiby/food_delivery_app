import express from "express";
import { getAllFoodItems, getFoodDetails, createFoodItem, updateFoodItem, deleteFoodItem } from "../controllers/foodControllers.js";
import { authRestaurant } from "../middlewares/authRestaurant.js"; // ✅ Restricts actions to restaurants only
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// ✅ Get all food items
router.get("/food-list", getAllFoodItems);

// ✅ Get details of a specific food item
router.get("/food-details/:foodId", getFoodDetails);

// ✅ Create a new food item (Only restaurant owners)
router.post("/create-food", authRestaurant, upload.single("image"), createFoodItem);

// ✅ Update a food item (Only restaurant owners)
router.put("/update-food/:foodId", authRestaurant, upload.single("image"), updateFoodItem);

// ✅ Delete a food item (Only restaurant owners)
router.delete("/delete-food/:foodId", authRestaurant, deleteFoodItem);

export { router as foodRouter };
