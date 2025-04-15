import Stripe from "stripe";
import { Payment } from "../models/paymentModel.js";
import { Order } from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Stripe with the secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Validate Client URL
if (!process.env.CLIENT_URL || !/^https?:\/\//.test(process.env.CLIENT_URL.trim())) {
  console.warn("CLIENT_URL is not defined or invalid in the environment. Using fallback URL.");
}
const clientUrl = process.env.CLIENT_URL && /^https?:\/\//.test(process.env.CLIENT_URL.trim())
  ? process.env.CLIENT_URL.trim()
  : 'http://localhost:5173';

console.log("Resolved CLIENT_URL:", clientUrl);

// Process Payment Controller
export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, items } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validate Payment Details
    if (!orderId || !paymentMethod || !amount || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing or invalid payment details" });
    }

    // === Cash On Delivery ===
    if (paymentMethod === "cod") {
      const payment = await Payment.create({
        userId: req.user._id,
        orderId,
        amount,
        paymentMethod,
        paymentStatus: "completed", // COD is always completed on order
      });

      await Order.findByIdAndUpdate(orderId, { status: "placed" });

      return res.json({
        message: "Order placed with Cash on Delivery",
        paymentStatus: "completed",
      });
    }

    // === Online Payment ===
    if (paymentMethod === "online") {
      try {
        // Prepare Stripe Line Items
        const lineItems = items.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.price_data.product_data.name === item.name);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push({
              price_data: {
                currency: process.env.STRIPE_CURRENCY || 'usd',
                product_data: {
                  name: item.name,
                },
                unit_amount: Math.round(Number(item.price) * 100), // convert to cents
              },
              quantity: item.quantity,
            });
          }
          return acc;
        }, []);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${clientUrl}/payment-cancel`,
          metadata: {
            userId: req.user._id.toString(), // Ensure userId is a string
            orderId: orderId.toString(), // Ensure orderId is a string
            items: JSON.stringify(items), // Convert items array to JSON string
            amount: amount.toString() // Ensure amount is a string
          }
        });

        return res.json({
          message: "Redirecting to Stripe",
          paymentMethod: "online",
          sessionId: session.id, // Ensure sessionId is included
          stripeUrl: session.url,
        });

      } catch (stripeError) {
        console.error("Stripe Session Creation Error:", stripeError);
        return res.status(500).json({
          message: "Failed to create Stripe session",
          error: stripeError.message,
        });
      }
    }

    // Unsupported Payment Method
    res.status(400).json({ message: "Unsupported payment method" });

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Verify Payment Controller
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Avoid re-verification
    if (payment.paymentStatus === "completed") {
      return res.json({ message: "Payment already verified", paymentVerified: true });
    }

    // Online Payment Verification
    if (payment.paymentMethod === "online") {
      const session = await stripe.checkout.sessions.retrieve(payment.stripeCheckoutSessionId);

      if (session.payment_status === "paid") {
        await Order.findByIdAndUpdate(orderId, { status: "placed" });
        await Payment.findByIdAndUpdate(payment._id, { paymentStatus: "completed" });

        return res.json({ message: "Payment verified successfully", paymentVerified: true });
      } else {
        return res.status(400).json({ message: "Payment verification failed", paymentVerified: false });
      }
    }

    // Cash on Delivery
    if (payment.paymentMethod === "cod") {
      return res.json({ message: "Cash on Delivery payment verified", paymentVerified: true });
    }

    res.status(400).json({ message: "Unsupported payment method for verification" });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
