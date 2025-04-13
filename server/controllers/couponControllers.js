// controllers/orderController.js

import mongoose from "mongoose";
import { Order } from "../models/orderModel.js";
import { FoodItem } from "../models/foodItemModel.js";
import { DeliveryPartner } from "../models/deliveryPartnerModel.js";

// ✅ Place an Order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { restaurantId, items, discount = 0, address, paymentMethod } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized: Missing user info" });
    if (!restaurantId || !Array.isArray(items) || items.length === 0 || !address || !paymentMethod)
      return res.status(400).json({ message: "All fields are required (restaurantId, items, address, paymentMethod)" });

    const firstItemRestaurantId = items[0].restaurantId;
    for (const item of items) {
      if (item.restaurantId !== firstItemRestaurantId)
        return res.status(400).json({ message: "All items must belong to the same restaurant" });
    }

    const normalizedPaymentMethod = paymentMethod.toLowerCase() === "cod" ? "CashOnDelivery" :
                                     paymentMethod.toLowerCase() === "online" ? "Online" : null;
    if (!normalizedPaymentMethod) return res.status(400).json({ message: "Invalid payment method" });

    let totalPrice = 0;
    const enrichedItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.foodId))
        return res.status(400).json({ message: `Invalid food ID: ${item.foodId}` });

      const foodItem = await FoodItem.findById(item.foodId);
      if (!foodItem) return res.status(404).json({ message: `Food item with ID ${item.foodId} not found` });

      totalPrice += foodItem.price * item.quantity;
      enrichedItems.push({ foodId: item.foodId, quantity: item.quantity, price: foodItem.price });
    }

    const finalPrice = Math.max(totalPrice - discount, 0);

    const newOrder = new Order({
      userId, restaurantId, items: enrichedItems, totalPrice, discount, finalPrice, address,
      paymentMethod: normalizedPaymentMethod, status: "Pending"
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", data: newOrder });
  } catch (error) {
    console.error("❌ Place Order Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Other order-related handlers (getOrderDetails, getUserOrders, updateOrderStatus, assignOrderToDeliveryPartner, cancelOrder, getAllOrders, getAllDeliveryPartners, getRestaurantOrders) would follow here, same as you wrote, unchanged.


// controllers/couponController.js

import { Coupon } from "../models/couponModel.js";

// ✅ Apply Coupon
export const applyCoupon = async (req, res) => {
  try {
    const { code, totalPrice } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) return res.status(400).json({ message: "Invalid or expired coupon" });
    if (new Date(coupon.expiryDate) < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "This coupon has expired" });
    }

    if (totalPrice < coupon.minOrderAmount)
      return res.status(400).json({ message: `Minimum order amount should be ₹${coupon.minOrderAmount}` });

    let discountAmount = Math.min((totalPrice * coupon.discount) / 100, coupon.maxDiscount);
    const finalPrice = totalPrice - discountAmount;

    res.json({ message: "Coupon applied successfully", discountAmount, finalPrice });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Create Coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, maxDiscount, minOrderAmount, expiryDate } = req.body;
    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) return res.status(400).json({ message: "Coupon code already exists" });
    if (discount < 1 || discount > 100) return res.status(400).json({ message: "Discount should be between 1% and 100%" });
    if (new Date(expiryDate) < new Date()) return res.status(400).json({ message: "Expiry date must be in the future" });

    const newCoupon = new Coupon({ code, discount, maxDiscount, minOrderAmount, expiryDate, isActive: true });
    await newCoupon.save();
    res.status(201).json({ message: "Coupon created successfully", data: newCoupon });
  } catch (error) {
    console.error("Create Coupon Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get Active Coupons
export const getAvailableCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const coupons = await Coupon.find({ isActive: true }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Coupon.countDocuments({ isActive: true });

    res.json({ message: "Active coupons retrieved successfully", data: coupons, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    console.error("Get Available Coupons Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Delete Coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!deletedCoupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Toggle Coupon Active/Inactive
export const toggleCouponStatus = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({ message: `Coupon is now ${coupon.isActive ? "active" : "inactive"}`, data: coupon });
  } catch (error) {
    console.error("Toggle Coupon Status Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
