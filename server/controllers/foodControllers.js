import { FoodItem } from "../models/foodItemModel.js";
import path from "path";
import fs from "fs";

// Get all unique categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await FoodItem.distinct("category");

    const categoryList = categories.map((name, index) => ({
      _id: `${index + 1}`,
      name,
      imageUrl: `/images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
    }));

    res.json({
      data: categoryList,
      message: categories.length ? "Categories retrieved successfully" : "No categories found",
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all food items (with optional category filtering)
export const getAllFoodItems = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    const foodList = await FoodItem.find(filter).populate("restaurant", "name");

    res.json({
      data: foodList,
      message: foodList.length ? "Food items retrieved successfully" : "No food items found for this category",
    });
  } catch (error) {
    console.error("Get Food Items Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get food details by ID
export const getFoodDetails = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid food ID format" });
    }

    const foodItem = await FoodItem.findById(foodId).populate("restaurant", "name");
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({ data: foodItem, message: "Food item details retrieved" });
  } catch (error) {
    console.error("Get Food Details Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Create a new food item (Only for restaurant owners)
export const createFoodItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const restaurantId = req.user.id;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields (name, description, price, category) are required" });
    }

    if (isNaN(parseFloat(price))) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // ✅ Save Cloudinary URL directly!
    const imagePath = req.file.path;

    const newFoodItem = new FoodItem({
      name,
      description,
      price: parseFloat(price),
      category: category.trim(),
      imageUrl: imagePath,
      restaurant: restaurantId,
    });

    await newFoodItem.save();
    res.status(201).json({ message: "Food item created successfully", data: newFoodItem });
  } catch (error) {
    console.error("Create Food Item Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update an existing food item
export const updateFoodItem = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { name, description, price, category } = req.body;
    const restaurantId = req.user.id;

    if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid food ID format" });
    }

    const foodItem = await FoodItem.findOne({ _id: foodId, restaurant: restaurantId });
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found or unauthorized to update" });
    }

    let updatedFields = {};
    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (price) {
      if (isNaN(parseFloat(price))) {
        return res.status(400).json({ message: "Invalid price value" });
      }
      updatedFields.price = parseFloat(price);
    }
    if (category) updatedFields.category = category.trim();

    if (req.file) {
      // ✅ Update Cloudinary image URL
      const newImagePath = req.file.path;

      updatedFields.imageUrl = newImagePath;
    }

    const updatedFoodItem = await FoodItem.findByIdAndUpdate(foodId, updatedFields, { new: true });
    res.json({ message: "Food item updated successfully", data: updatedFoodItem });
  } catch (error) {
    console.error("Update Food Item Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete an existing food item
export const deleteFoodItem = async (req, res) => {
  try {
    const { foodId } = req.params;
    const restaurantId = req.user.id;

    if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid food ID format" });
    }

    const foodItem = await FoodItem.findOne({ _id: foodId, restaurant: restaurantId });
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found or unauthorized to delete" });
    }

    await FoodItem.findByIdAndDelete(foodId);
    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Delete Food Item Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
