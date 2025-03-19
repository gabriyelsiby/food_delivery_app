import { Restaurant } from "../models/restaurantModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

//  Register a new restaurant
export const registerRestaurant = async (req, res) => {
    try {
        const { name, email, password, location, cuisine, phone, isOpen } = req.body;

        if (!name || !email || !password || !location || !cuisine || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newRestaurant = new Restaurant({
            name,
            email,
            password: hashedPassword,
            location,
            cuisine,
            phone,
            isOpen: isOpen ?? true
        });

        await newRestaurant.save();
        const token = generateToken(newRestaurant._id, "restaurant");

        //  Store token in cookies
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });

        res.status(201).json({ 
            message: "Restaurant registered successfully", 
            data: { name: newRestaurant.name, email: newRestaurant.email, location: newRestaurant.location } 
        });
    } catch (error) {
        console.error("Restaurant Registration Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//  Restaurant Login
export const restaurantLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const passwordMatch = bcrypt.compareSync(password, restaurant.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(restaurant._id, "restaurant");

        //  Store token in cookies
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });

        res.json({ 
            message: "Login successful", 
            data: { name: restaurant.name, email: restaurant.email, location: restaurant.location } 
        });
    } catch (error) {
        console.error("Restaurant Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//  Get Restaurant Profile
export const restaurantProfile = async (req, res) => {
    try {
        const restaurantId = req.user.id;
        const restaurant = await Restaurant.findById(restaurantId).select("-password");

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json({ 
            message: "Restaurant profile retrieved", 
            data: restaurant
        });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//  Update Restaurant Profile
export const updateRestaurantProfile = async (req, res) => {
    try {
        const restaurantId = req.user.id;  //  Extract restaurant ID from JWT
        const { name, email, location, cuisine, phone, isOpen } = req.body;

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { name, email, location, cuisine, phone, isOpen },
            { new: true, runValidators: true }
        ).select("-password"); //  Exclude password from response

        if (!updatedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json({ 
            message: "Profile updated successfully", 
            data: updatedRestaurant 
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//  Logout Restaurant
export const restaurantLogout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
