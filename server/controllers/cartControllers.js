import { Cart } from "../models/cartModel.js";
import { FoodItem } from "../models/foodItemModel.js";

// ✅ Add Food to Cart
export const addFoodToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { foodId, quantity } = req.body;

        const foodItem = await FoodItem.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const foodExists = cart.items.some((item) => item.foodId.equals(foodId));
        if (foodExists) {
            return res.status(400).json({ message: "Food item already in cart" });
        }

        cart.items.push({ foodId, quantity, price: foodItem.price });
        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ data: cart, message: "Food item added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Get Cart Details
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("items.foodId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json({ data: cart, message: "Cart fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Remove Food from Cart
export const removeFoodFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { foodId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => !item.foodId.equals(foodId));
        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ data: cart, message: "Food item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
