import { FoodItem } from "../models/foodItemModel.js";
import path from "path";
import fs from "fs";

// ✅ Get all food items
export const getAllFoodItems = async (req, res) => {
    try {
        const foodList = await FoodItem.find();
        res.json({ data: foodList, message: "Food items retrieved successfully" });
    } catch (error) {
        console.error("Get Food Items Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get food details by ID
export const getFoodDetails = async (req, res) => {
    try {
        const { foodId } = req.params;

        // ✅ Validate foodId
        if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid food ID format" });
        }

        const foodItem = await FoodItem.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.json({ data: foodItem, message: "Food item details retrieved" });
    } catch (error) {
        console.error("Get Food Details Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Create a new food item (Only for restaurant owners)
export const createFoodItem = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { name, description, price, category } = req.body;
        const restaurantId = req.user.id; // ✅ Get restaurant ID from JWT

        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All fields (name, description, price, category) are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // ✅ Ensure "uploads" directory exists
        const uploadDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // ✅ Store uploaded image in the local server
        const imagePath = `uploads/${req.file.filename}`;

        const newFoodItem = new FoodItem({
            name,
            description,
            price,
            category,
            imageUrl: imagePath,  // ✅ Correctly format image path
            restaurant: restaurantId
        });

        await newFoodItem.save();
        res.status(201).json({ message: "Food item created successfully", data: newFoodItem });

    } catch (error) {
        console.error("Create Food Item Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Update an existing food item (Only for the restaurant that owns it)
export const updateFoodItem = async (req, res) => {
    try {
        const { foodId } = req.params;
        const { name, description, price, category } = req.body;
        const restaurantId = req.user.id;

        // ✅ Validate foodId
        if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid food ID format" });
        }

        const foodItem = await FoodItem.findOne({ _id: foodId, restaurant: restaurantId });

        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found or unauthorized to update" });
        }

        let updatedFields = { name, description, price, category };

        // ✅ Handle image update
        if (req.file) {
            const newImagePath = `uploads/${req.file.filename}`;

            if (foodItem.imageUrl && fs.existsSync(foodItem.imageUrl)) {
                fs.unlinkSync(foodItem.imageUrl); // ✅ Delete old image
            }

            updatedFields.imageUrl = newImagePath;
        }

        const updatedFoodItem = await FoodItem.findByIdAndUpdate(foodId, updatedFields, { new: true });

        res.json({ message: "Food item updated successfully", data: updatedFoodItem });

    } catch (error) {
        console.error("Update Food Item Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Delete an existing food item (Only for the restaurant that owns it)
export const deleteFoodItem = async (req, res) => {
    try {
        const { foodId } = req.params;
        const restaurantId = req.user.id;

        // ✅ Validate foodId
        if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid food ID format" });
        }

        const foodItem = await FoodItem.findOne({ _id: foodId, restaurant: restaurantId });

        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found or unauthorized to delete" });
        }

        // ✅ Delete image file
        if (foodItem.imageUrl && fs.existsSync(foodItem.imageUrl)) {
            fs.unlinkSync(foodItem.imageUrl);
        }

        await FoodItem.findByIdAndDelete(foodId);

        res.json({ message: "Food item deleted successfully" });

    } catch (error) {
        console.error("Delete Food Item Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
