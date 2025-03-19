import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { addToCart, getCart, updateCart, removeFromCart, clearCart } from "../controllers/cartControllers.js"; // Updated filename

const router = express.Router();


router.post("/add", authUser, addToCart);


router.get("/", authUser, getCart);


router.put("/update", authUser, updateCart);


router.delete("/remove", authUser, removeFromCart);


router.delete("/clear", authUser, clearCart);

export { router as cartRouter };
