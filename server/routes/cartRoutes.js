import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { addToCart, getCart, updateCart, removeFromCart, clearCart } from "../controllers/cartControllers.js"; // Updated filename

const router = express.Router();

// ✅ Add or Update a food item in the cart
router.post("/add", authUser, addToCart);

// ✅ Get cart details
router.get("/", authUser, getCart);

// ✅ Update cart item quantity
router.put("/update", authUser, updateCart);

// ✅ Remove a food item from the cart
router.delete("/remove", authUser, removeFromCart);

// ✅ Clear the entire cart
router.delete("/clear", authUser, clearCart);

export { router as cartRouter };
