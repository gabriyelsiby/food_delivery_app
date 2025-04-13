import express from "express";
import { processPayment, verifyPayment } from "../controllers/paymentController.js"; // ✅ fixed the import name
import { authUser } from "../middlewares/authUser.js"; // Ensure that authUser middleware is correctly implemented

const router = express.Router();

// Process a new payment (Cash on Delivery or Online with Stripe)
router.post("/process-payment", authUser, processPayment);

// Verify payment status (Handle Stripe success or failure)
router.get("/verify-payment/:orderId", authUser, verifyPayment);

export { router as paymentRouter };
