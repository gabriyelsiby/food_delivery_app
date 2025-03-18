import express from "express";
import { userRouter } from "./userRoutes.js";
import { restaurantRouter } from "./restaurantRoutes.js";
import { foodRouter } from "./foodRoutes.js";
import { cartRouter } from "./cartRoutes.js";
import { orderRouter } from "./orderRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
import { deliveryPartnerRouter } from "./deliveryPartnerRoutes.js"; // ✅ Ensured correct naming
import { couponRouter } from "./couponRoutes.js";

const router = express.Router();

// ✅ User-related routes
router.use("/users", userRouter);

// ✅ Restaurant-related routes
router.use("/restaurants", restaurantRouter);

// ✅ Food item routes
router.use("/foods", foodRouter);

// ✅ Cart routes
router.use("/cart", cartRouter);

// ✅ Order routes
router.use("/orders", orderRouter);

// ✅ Review routes
router.use("/reviews", reviewRouter);

// ✅ Payment routes
router.use("/payments", paymentRouter);

// ✅ Delivery partner routes
router.use("/delivery-partners", deliveryPartnerRouter); // ✅ Standardized naming

// ✅ Coupon routes
router.use("/coupons", couponRouter);

export { router as apiRouter };
