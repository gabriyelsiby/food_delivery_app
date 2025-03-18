import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { addFoodToCart, getCart, removeFoodFromCart } from "../controllers/cartControllers.js";

const router = express.Router();

// Add food item to cart
router.post("/add-to-cart", authUser, addFoodToCart);

// Remove food item from cart
router.delete("/remove-from-cart", authUser, removeFoodFromCart);

// Get cart details
router.get("/get-cart-details", authUser, getCart);

export { router as cartRouter };
