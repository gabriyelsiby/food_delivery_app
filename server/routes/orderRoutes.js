import express from "express";
import { placeOrder, getOrderDetails, getUserOrders, updateOrderStatus, cancelOrder } from "../controllers/orderControllers.js";
import { authUser } from "../middlewares/authUser.js";
import { authRestaurant } from "../middlewares/authRestaurant.js";

const router = express.Router();

// Place a new order (User only)
router.post("/place-order", authUser, placeOrder);
// Add this route to support the frontend code
router.post("/", authUser, placeOrder);  // This supports the /orders endpoint in your React code

// Get details of a specific order
router.get("/order-details/:orderId", authUser, getOrderDetails);

// Get all orders for a user
router.get("/user-orders", authUser, getUserOrders);

// Update order status (Only restaurant)
router.put("/update-order/:orderId", authRestaurant, updateOrderStatus);

// Cancel an order (Only user)
router.delete("/cancel-order/:orderId", authUser, cancelOrder);

export { router as orderRouter };