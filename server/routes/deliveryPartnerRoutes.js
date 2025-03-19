import express from "express";
import {
    registerDeliveryPartner,
    loginDeliveryPartner,
    getDeliveryPartnerProfile,
    getAssignedOrders,
    updateDeliveryStatus,
    assignOrder,
    logoutDeliveryPartner
} from "../controllers/deliveryPartnerControllers.js";
import { authDeliveryPartner } from "../middlewares/authDeliveryPartner.js"; 
import { authAdmin } from "../middlewares/authAdmin.js"; // ✅ Only Admin can assign orders

const router = express.Router();

// ✅ Register a new delivery partner
router.post("/register", registerDeliveryPartner);

// ✅ Login a delivery partner
router.post("/login", loginDeliveryPartner);

// ✅ Get delivery partner profile
router.get("/profile", authDeliveryPartner, getDeliveryPartnerProfile);

// ✅ Get assigned orders
router.get("/assigned-orders", authDeliveryPartner, getAssignedOrders);

// ✅ Update order status (Only for delivery partners)
router.put("/update-order-status/:orderId", authDeliveryPartner, updateDeliveryStatus);

// ✅ Assign an order to a delivery partner (Admin Only)
router.put("/assign-order/:orderId", authAdmin, assignOrder);

// ✅ Logout delivery partner
router.get("/logout", authDeliveryPartner, logoutDeliveryPartner);

export { router as deliveryRouter };  // ✅ Ensure this line is correct
