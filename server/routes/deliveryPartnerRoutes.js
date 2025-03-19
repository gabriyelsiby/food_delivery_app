import express from "express";
import {
    registerDeliveryPartner,
    loginDeliveryPartner,
    getDeliveryPartnerProfile,
    getAssignedOrders,
    updateDeliveryStatus,
    logoutDeliveryPartner
} from "../controllers/deliveryPartnerControllers.js";
import { authDeliveryPartner } from "../middlewares/authDeliveryPartner.js"; 

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

// ✅ Logout delivery partner
router.get("/logout", authDeliveryPartner, logoutDeliveryPartner);

export { router as deliveryRouter };
