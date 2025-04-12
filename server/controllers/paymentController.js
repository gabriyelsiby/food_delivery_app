import { Payment } from "../models/paymentModel.js";
import { Order } from "../models/orderModel.js";

export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;

    if (!orderId || !paymentMethod || !amount) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    if (paymentMethod === "cod") {
      const payment = await Payment.create({
        userId: req.user._id,
        orderId,
        amount,
        paymentMethod,
        paymentStatus: "completed",
      });

      await Order.findByIdAndUpdate(orderId, { status: "placed" });

      return res.json({
        message: "Order placed with Cash on Delivery",
        paymentStatus: "completed",
      });
    }

    if (paymentMethod === "online") {
      return res.json({
        message: "Redirect to Stripe",
        paymentMethod: "online",
        stripeUrl: "https://checkout.stripe.com/test-session",
      });
    }

    res.status(400).json({ message: "Unsupported payment method" });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const paymentVerified = true;

    res.json({ message: "Payment verified", paymentVerified });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
