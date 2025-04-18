import { Cart } from "../models/cartModel.js";
import { FoodItem } from "../models/foodItemModel.js";

// Helper: Recalculate Total Price
const calculateCartTotal = async (cart) => {
    let total = 0;
    for (const item of cart.items) {
        const food = await FoodItem.findById(item.foodId);
        if (food) {
            if (food.price !== item.price) {
                // Optionally log this issue or notify if prices don't match
                console.warn(`Price mismatch for food ID ${item.foodId}`);
                item.price = food.price; // Optionally update or notify
            }
            total += item.quantity * item.price;
        } else {
            // Handle the case where the food item is not found in the database
            console.log(`Food item with ID ${item.foodId} not found`);
        }
    }
    cart.totalPrice = total;
};

// Add to Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { foodId, quantity } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized user" });
        if (!foodId || quantity <= 0) {
            return res.status(400).json({ message: "Valid Food ID and quantity are required" });
        }

        const foodItem = await FoodItem.findById(foodId);
        if (!foodItem) return res.status(404).json({ message: "Food item not found" });

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });

        const existingItem = cart.items.find(item => item.foodId.equals(foodId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ foodId, quantity, price: foodItem.price });
        }

        await calculateCartTotal(cart);
        await cart.save();

        res.status(200).json({ message: "Food item added to cart", data: cart });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized user" });

        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                message: "Cart is empty",
                data: {
                    items: [],
                    totalPrice: 0,
                },
            });
        }

        const formattedItems = await Promise.all(
            cart.items.map(async (item) => {
                const food = await FoodItem.findById(item.foodId).populate("restaurant", "name logoUrl");

                if (!food) {
                    // If food item is not found, handle accordingly
                    console.log(`Food item with ID ${item.foodId} not found`);
                    return null; // You can return a fallback or just ignore
                }

                return {
                    foodId: food._id,
                    name: food.name,
                    imageUrl: food.imageUrl,
                    price: item.price,
                    quantity: item.quantity,
                    restaurantId: food.restaurant
                        ? {
                              _id: food.restaurant._id,
                              name: food.restaurant.name,
                              logoUrl: food.restaurant.logoUrl || null,
                          }
                        : null,
                };
            })
        );

        // Filter out null values if any item was missing
        const validItems = formattedItems.filter(item => item !== null);

        res.status(200).json({
            message: "Cart retrieved successfully",
            data: {
                items: validItems,
                totalPrice: cart.totalPrice,
            },
        });
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Cart
export const updateCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { foodId, quantity } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized user" });
        if (!foodId || quantity < 0) {
            return res.status(400).json({ message: "Valid Food ID and quantity are required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.foodId.equals(foodId));
        if (itemIndex === -1) return res.status(404).json({ message: "Food item not found in cart" });

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
            res.status(200).json({ message: "Food item removed from cart", data: cart });
        } else {
            cart.items[itemIndex].quantity = quantity;
            res.status(200).json({ message: "Cart updated successfully", data: cart });
        }

        await calculateCartTotal(cart);
        await cart.save();
    } catch (error) {
        console.error("Update Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { foodId } = req.body;

        if (!userId) return res.status(401).json({ message: "Unauthorized user" });
        if (!foodId) return res.status(400).json({ message: "Food ID is required" });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => !item.foodId.equals(foodId));

        await calculateCartTotal(cart);
        await cart.save();

        res.status(200).json({ message: "Food item removed from cart", data: cart });
    } catch (error) {
        console.error("Remove from Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized user" });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", data: cart });
    } catch (error) {
        console.error("Clear Cart Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
