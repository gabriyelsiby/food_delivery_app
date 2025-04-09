import express from "express";
import { 
    applyCoupon, 
    createCoupon, 
    getAvailableCoupons, 
    deleteCoupon, 
    toggleCouponStatus 
} from "../controllers/couponControllers.js";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

// Apply a coupon (User)
router.post("/apply", authUser, applyCoupon);

// Create a new coupon (Admin)
router.post("/", authAdmin, createCoupon); // Updated to match "/coupons" POST

// Get Available Coupons (User)
router.get("/", authUser, getAvailableCoupons); // Updated to match "/coupons" GET

// Delete a coupon (Admin)
router.delete("/:couponId", authAdmin, deleteCoupon); // Updated to match "/coupons/:id" DELETE

// Toggle coupon status active/inactive (Admin Only)
router.patch("/toggle/:couponId", authAdmin, toggleCouponStatus); // Updated to match "/coupons/toggle/:id" PATCH

export { router as couponRouter };
