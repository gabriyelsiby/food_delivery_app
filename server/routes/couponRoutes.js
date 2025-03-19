import express from "express";
import { 
    applyCoupon, 
    createCoupon, 
    getAllCoupons, 
    deleteCoupon 
} from "../controllers/couponControllers.js";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();


router.post("/apply", authUser, applyCoupon);


router.post("/create", authAdmin, createCoupon);


router.get("/all", authAdmin, getAllCoupons);


router.delete("/delete/:couponId", authAdmin, deleteCoupon); 

export { router as couponRouter };