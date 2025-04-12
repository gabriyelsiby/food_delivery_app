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
import { authAdmin } from "../middlewares/authAdmin.js"; 
const router = express.Router();


router.post("/register", registerDeliveryPartner);

router.post("/login", loginDeliveryPartner);

router.get("/profile", authDeliveryPartner, getDeliveryPartnerProfile);

router.get("/assigned-orders", authDeliveryPartner, getAssignedOrders);

router.put("/update-order-status/:orderId", authDeliveryPartner, updateDeliveryStatus);

router.put("/assign-order/:orderId", authAdmin, assignOrder);

router.post("/logout", authDeliveryPartner, logoutDeliveryPartner);

export { router as deliveryRouter }; 
