import express from "express";
import {
  placeOrder,
  getOrderDetails,
  getUserOrders,
  updateOrderStatus,
  assignOrderToDeliveryPartner,
  cancelOrder,
} from "../controllers/orderControllers.js";

import { authUser } from "../middlewares/authUser.js";
import { authRestaurant } from "../middlewares/authRestaurant.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

/**
 * USER ROUTES
 */

// Get all orders of the user (should come first to avoid conflict with /:orderId)
router.get("/user/all", authUser, getUserOrders); // GET /orders/user/all

// Place a new order
router.post("/", authUser, placeOrder); // POST /orders

// Get details of a specific order
router.get("/:orderId", authUser, getOrderDetails); // GET /orders/:orderId

// Cancel an order
router.delete("/:orderId", authUser, cancelOrder); // DELETE /orders/:orderId

/**
 * RESTAURANT ROUTES
 */

// Update order status
router.put("/:orderId/status", authRestaurant, updateOrderStatus); // PUT /orders/:orderId/status

/**
 * ADMIN ROUTES
 */

// Assign a delivery partner to an order
router.put("/:orderId/assign", authAdmin, assignOrderToDeliveryPartner); // PUT /orders/:orderId/assign

export { router as orderRouter };
