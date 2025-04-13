import Stripe from "stripe";
import { Payment } from "../models/paymentModel.js";
import { Order } from "../models/orderModel.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Stripe with the secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Debugging: Log the CLIENT_URL value and fallback usage
if (!process.env.CLIENT_URL) {
  console.warn("CLIENT_URL is not defined in the environment. Using fallback URL.");
}

const clientUrl = process.env.CLIENT_URL && process.env.CLIENT_URL.trim() !== "" 
  ? process.env.CLIENT_URL 
  : 'http://localhost:5173';

console.log("Resolved CLIENT_URL:", clientUrl);

// Process the payment based on the selected method
export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, items } = req.body;

    // Validate the payment details
    if (!orderId || !paymentMethod || !amount || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing or invalid payment details" });
    }

    // Handle Cash on Delivery (COD) payment
    if (paymentMethod === "cod") {
      // Create a new payment record
      const payment = await Payment.create({
        userId: req.user._id,
        orderId,
        amount,
        paymentMethod,
        paymentStatus: "completed", // COD payments are considered complete immediately
      });

      // Update the order status to "placed"
      await Order.findByIdAndUpdate(orderId, { status: "placed" });

      // Respond with a success message
      return res.json({
        message: "Order placed with Cash on Delivery",
        paymentStatus: "completed",
      });
    }

    // Handle Online Payment via Stripe
    if (paymentMethod === "online") {
      try {
        // Group items by price and calculate quantities
        const lineItems = items.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.price_data.product_data.name === item.name);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: item.name, // Ensure item name is unique
                },
                unit_amount: item.price * 100, // Convert to cents
              },
              quantity: item.quantity,
            });
          }
          return acc;
        }, []);

        // Create a new Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${clientUrl}/payment-cancel`,
        });

        // Debugging: Log the session object
        console.log("Stripe Checkout Session Created:", session);

        // Create a new payment record
        const payment = await Payment.create({
          userId: req.user._id,
          orderId,
          amount,
          paymentMethod,
          paymentStatus: "pending", // Set the payment status to pending for online payments
          stripeCheckoutSessionId: session.id, // Save the Stripe checkout session ID
        });

        // Respond with the Stripe Checkout session ID
        return res.json({
          message: "Redirecting to Stripe",
          paymentMethod: "online",
          sessionId: session.id, // Include sessionId in the response
          stripeUrl: session.url, // Send the session URL for the frontend to redirect to
        });
      } catch (stripeError) {
        console.error("Stripe Session Creation Error:", stripeError);
        return res.status(500).json({ message: "Failed to create Stripe session", error: stripeError.message });
      }
    }

    // Handle unsupported payment methods
    res.status(400).json({ message: "Unsupported payment method" });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Verify the payment after processing
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate the order ID
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Fetch the payment record from the database
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Verify if the payment has been completed (for online payments)
    if (payment.paymentMethod === "online") {
      const session = await stripe.checkout.sessions.retrieve(payment.stripeCheckoutSessionId);

      if (session.payment_status === "paid") {
        // Update the order and payment status to completed
        await Order.findByIdAndUpdate(orderId, { status: "placed" });
        await Payment.findByIdAndUpdate(payment._id, { paymentStatus: "completed" });

        return res.json({ message: "Payment verified successfully", paymentVerified: true });
      } else {
        return res.status(400).json({ message: "Payment verification failed", paymentVerified: false });
      }
    }

    // If it's a COD payment, it's considered automatically verified
    if (payment.paymentMethod === "cod") {
      return res.json({ message: "Cash on Delivery payment verified", paymentVerified: true });
    }

    res.status(400).json({ message: "Unsupported payment method for verification" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
