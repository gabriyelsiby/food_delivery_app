import express from "express";
import { userRouter } from "./userRoutes.js";
import { restaurantRouter } from "./restaurantRoutes.js";
import { foodRouter } from "./foodRoutes.js";
import { cartRouter } from "./cartRoutes.js";
import { orderRouter } from "./orderRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
import { deliveryRouter } from "./deliveryPartnerRoutes.js"; // ✅ Fix this import
import { couponRouter } from "./couponRoutes.js"; 

const router = express.Router();

// ✅ Register routes properly
router.use("/user", userRouter);
router.use("/restaurant", restaurantRouter);
router.use("/food", foodRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/review", reviewRouter);
router.use("/payment", paymentRouter);
router.use("/delivery", deliveryRouter); // ✅ Fix the name here
router.use("/coupon", couponRouter);

export { router as apiRouter };
