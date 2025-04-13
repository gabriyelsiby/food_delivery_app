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

// ✅ Apply a coupon (User Only)
router.post("/apply", authUser, applyCoupon);

// ✅ Create a new coupon (Admin Only)
router.post("/create", authAdmin, createCoupon);

// ✅ Get available active coupons (User)
router.get("/available", authUser, getAvailableCoupons);

// ✅ Delete a coupon by ID (Admin Only)
router.delete("/delete/:couponId", authAdmin, deleteCoupon);

// ✅ Toggle coupon status active/inactive (Admin Only)
router.patch("/toggle-status/:couponId", authAdmin, toggleCouponStatus);

export { router as couponRouter };
