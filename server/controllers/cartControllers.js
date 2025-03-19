import { Cart } from "../models/cartModel.js";
import { FoodItem } from "../models/foodItemModel.js";

//  Add or Update Food in Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { foodId, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        if (!foodId || quantity <= 0) {
            return res.status(400).json({ message: "Valid Food ID and quantity are required" });
        }

        const foodItem = await FoodItem.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        //  Check if item already exists in the cart
        const existingItem = cart.items.find((item) => item.foodId.equals(foodId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ foodId, quantity, price: foodItem.price });
        }

        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ message: "Food item added to cart", data: cart });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Get Cart Details
export const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const cart = await Cart.findOne({ userId }).populate("items.foodId", "name price imageUrl");
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        res.status(200).json({ message: "Cart retrieved successfully", data: cart });
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Update Cart Item Quantity
export const updateCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { foodId, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        if (!foodId || quantity <= 0) {
            return res.status(400).json({ message: "Valid Food ID and quantity are required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find((item) => item.foodId.equals(foodId));
        if (!item) {
            return res.status(404).json({ message: "Food item not found in cart" });
        }

        item.quantity = quantity;
        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ message: "Cart updated successfully", data: cart });
    } catch (error) {
        console.error("Update Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Remove Food from Cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { foodId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        if (!foodId) {
            return res.status(400).json({ message: "Food ID is required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => !item.foodId.equals(foodId));
        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ message: "Food item removed from cart", data: cart });
    } catch (error) {
        console.error("Remove from Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//  Clear Entire Cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", data: cart });
    } catch (error) {
        console.error("Clear Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
