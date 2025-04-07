import express from "express";
import {
  getAllFoodItems,
  getFoodDetails,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getAllCategories,
} from "../controllers/foodControllers.js";
import { authRestaurant } from "../middlewares/authRestaurant.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// ✅ Route to get all categories
router.get("/categories", getAllCategories);

// ✅ Route to get all food items (with optional category filter)
router.get("/food-list", getAllFoodItems);

// ✅ Route to get a food item by ID
router.get("/food-details/:foodId", getFoodDetails);

// ✅ Route to create food (restaurant only)
router.post("/create-food", authRestaurant, upload.single("image"), createFoodItem);

// ✅ Route to update food (restaurant only)
router.put("/update-food/:foodId", authRestaurant, upload.single("image"), updateFoodItem);

// ✅ Route to delete food (restaurant only)
router.delete("/delete-food/:foodId", authRestaurant, deleteFoodItem);

export { router as foodRouter };
