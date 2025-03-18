import express from "express";
import { authDeliveryPartner } from "../middlewares/authDeliveryPartner.js";
import { assignOrder, updateDeliveryStatus, getAssignedOrders } from "../controllers/deliveryPartnerControllers.js";

const router = express.Router();

// Get assigned orders for a delivery partner
router.get("/assigned-orders", authDeliveryPartner, getAssignedOrders);

// Update delivery status (e.g., Out for Delivery, Delivered)
router.put("/update-status/:orderId", authDeliveryPartner, updateDeliveryStatus);

// Assign an order to a delivery partner (Admin or automated system)
router.post("/assign-order/:orderId", assignOrder);

export { router as deliveryPartnerRouter };
