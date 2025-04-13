import express from "express";
import {
  placeOrder,
  getOrderDetails,
  getUserOrders,
  updateOrderStatus,
  assignOrderToDeliveryPartner,
  cancelOrder,
  getAllOrders,
  getAllDeliveryPartners,
  getRestaurantOrders,
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
 * ADMIN ROUTES
 */
// Get all orders
router.get("/admin/all", authAdmin, getAllOrders); // GET /orders/admin/all

// Get all delivery partners
router.get("/admin/delivery-partners", authAdmin, getAllDeliveryPartners); // GET /orders/admin/delivery-partners

// Assign a delivery partner to an order
router.put("/:orderId/assign", authAdmin, assignOrderToDeliveryPartner); // PUT /orders/:orderId/assign

/**
 * RESTAURANT ROUTES
 */
// Update order status
router.put("/:orderId/status", authRestaurant, updateOrderStatus); // PUT /orders/:orderId/status

// Get all orders for a specific restaurant
router.get("/restaurant/orders", authRestaurant, getRestaurantOrders); // GET /orders/restaurant/orders

export { router as orderRouter };
