import mongoose from "mongoose";
import Stripe from "stripe";
import { Order } from "../models/orderModel.js";
import { FoodItem } from "../models/foodItemModel.js";
import { DeliveryPartner } from "../models/deliveryPartnerModel.js"; // Add this import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Place an Order (User Only)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { restaurantId, items, discount = 0, address, paymentMethod } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user info" });
    }

    if (!restaurantId || !Array.isArray(items) || items.length === 0 || !address || !paymentMethod) {
      return res.status(400).json({
        message: "All fields are required (restaurantId, items, address, paymentMethod)",
      });
    }

    // Validate that all items belong to the same restaurant
    const firstItemRestaurantId = items[0].restaurantId;
    for (const item of items) {
      if (item.restaurantId !== firstItemRestaurantId) {
        return res.status(400).json({ message: "All items must belong to the same restaurant" });
      }
    }

    // Normalize payment method
    const normalizedPaymentMethod = paymentMethod.toLowerCase() === "cod"
      ? "CashOnDelivery"
      : paymentMethod.toLowerCase() === "online"
      ? "Online"
      : null;

    if (!normalizedPaymentMethod) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    let totalPrice = 0;
    const enrichedItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.foodId)) {
        return res.status(400).json({ message: `Invalid food ID: ${item.foodId}` });
      }

      const foodItem = await FoodItem.findById(item.foodId);
      if (!foodItem) {
        return res.status(404).json({ message: `Food item with ID ${item.foodId} not found` });
      }

      const price = foodItem.price;
      totalPrice += price * item.quantity;

      enrichedItems.push({
        foodId: item.foodId,
        quantity: item.quantity,
        price,
      });
    }

    const finalPrice = Math.max(totalPrice - discount, 0);

    // 💳 If payment method is 'Online', create Stripe Checkout session
    if (normalizedPaymentMethod === "Online") {
      const lineItems = enrichedItems.map(item => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: `Food Item ID: ${item.foodId}`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
        metadata: {
          userId: userId?.toString(),
          restaurantId: restaurantId?.toString(),
          items: JSON.stringify(enrichedItems),
          address: JSON.stringify(address),
          discount: discount?.toString(),
          finalPrice: finalPrice?.toString(),
          totalPrice: totalPrice?.toString()
        }
      });

      return res.status(200).json({
        message: "Stripe Checkout session created",
        sessionId: session.id,
      });
    }

    // 💵 If payment method is 'CashOnDelivery', save the order directly
    const newOrder = new Order({
      userId,
      restaurantId,
      items: enrichedItems,
      totalPrice,
      discount,
      finalPrice,
      address,
      paymentMethod: normalizedPaymentMethod,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully with Cash On Delivery",
      data: newOrder,
    });
  } catch (error) {
    console.error("❌ Place Order Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get Order Details by ID
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("restaurantId", "name address")
      .populate("items.foodId", "name price imageUrl")
      .populate("deliveryPartner", "name mobile vehicleType");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order details retrieved", data: order });
  } catch (error) {
    console.error("❌ Get Order Details Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get All Orders for Logged-in User
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("restaurantId", "name address")
      .populate("items.foodId", "name price imageUrl");

    res.json({ message: "User orders retrieved", data: orders });
  } catch (error) {
    console.error("❌ Get User Orders Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Update Order Status (Restaurant Only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const restaurantId = req.user?.id;

    const validStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to '${status}'`, data: order });
  } catch (error) {
    console.error("❌ Update Order Status Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Assign Delivery Partner (Admin Only)
export const assignOrderToDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(deliveryPartnerId)) {
      return res.status(400).json({ message: "Invalid order ID or delivery partner ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryPartner = deliveryPartnerId;
    order.status = "Out for Delivery";
    await order.save();

    res.json({ message: "Order assigned to delivery partner", data: order });
  } catch (error) {
    console.error("❌ Assign Delivery Partner Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Cancel Order (User Only)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No token provided or invalid token" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order. Current status: ${order.status}` });
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date(); // Add a timestamp for cancellation

    // Use `save` with `validateModifiedOnly` to avoid validating unmodified fields like `paymentMethod`
    await order.save({ validateModifiedOnly: true });

    res.json({ message: "Order cancelled successfully", data: order });
  } catch (error) {
    console.error("❌ Cancel Order Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get All Orders (Admin Only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("restaurantId", "name address")
      .populate("items.foodId", "name price imageUrl")
      .populate("deliveryPartner", "name mobile vehicleType");

    res.json({ message: "All orders fetched successfully", data: orders });
  } catch (error) {
    console.error("❌ Get All Orders Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get All Delivery Partners (Admin Only)
export const getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({}, "name vehicleType mobile");

    res.json({ message: "Delivery partners retrieved", data: partners });
  } catch (error) {
    console.error("❌ Get All Delivery Partners Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get Orders for a Specific Restaurant (Restaurant Only)
export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const orders = await Order.find({ restaurantId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")  // <-- this is the customer's name
      .populate("items.foodId", "name price imageUrl");

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error("❌ Get Restaurant Orders Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
