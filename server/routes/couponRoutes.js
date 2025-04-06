import express from "express";
import { 
    applyCoupon, 
    createCoupon, 
    getAllCoupons, 
    deleteCoupon, 
    toggleCouponStatus 
} from "../controllers/couponControllers.js";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

// Apply a coupon (User)
router.post("/apply", authUser, applyCoupon);

// Create a new coupon (Admin)
router.post("/create", authAdmin, createCoupon);

// Get all coupons (Admin)
router.get("/all", authAdmin, getAllCoupons);

// Delete a coupon (Admin)
router.delete("/delete/:couponId", authAdmin, deleteCoupon);

// Toggle coupon status active/inactive (Admin)
router.patch("/toggle-status/:couponId", authAdmin, toggleCouponStatus);

export { router as couponRouter };
