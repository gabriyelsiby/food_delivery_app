import express from "express";
import { applyCoupon, createCoupon, getAllCoupons } from "../controllers/couponControllers.js";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

// Apply coupon to an order (User)
router.post("/apply", authUser, applyCoupon);

// Create a new coupon (Admin)
router.post("/create", authAdmin, createCoupon);

// Get all coupons (Admin)
router.get("/all", authAdmin, getAllCoupons);

export { router as couponRouter };
