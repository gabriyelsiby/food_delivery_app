import express from "express";
import { processPayment, verifyPayment } from "../controllers/paymentControllers.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

// Process a new payment
router.post("/process-payment", authUser, processPayment);

// Verify payment status
router.get("/verify-payment/:orderId", authUser, verifyPayment);

export { router as paymentRouter };
