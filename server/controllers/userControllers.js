import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import fs from "fs";
import path from "path";

// ✅ Check if User is Authenticated
export const checkUser = async (req, res) => {
    try {
        res.json({ message: "User is authenticated", user: req.user });
    } catch (error) {
        console.error("Check User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ User Signup (Stores JWT in Cookies)
export const userSignup = async (req, res) => {
    try {
        const { name, email, password, mobile, address, role } = req.body;

        if (!name || !email || !password || !mobile || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile,
            address,
            role: role || "user",
        });

        await newUser.save();
        const token = generateToken(newUser._id, newUser.role);

        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  
            sameSite: "Lax",
        });

        res.status(201).json({ 
            message: "Signup successful", 
            data: { name: newUser.name, email: newUser.email, role: newUser.role, profilePic: newUser.profilePic } 
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ User Login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  
            sameSite: "Lax",
        });

        res.json({ 
            message: "Login successful", 
            data: { name: user.name, email: user.email, role: user.role, profilePic: user.profilePic } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get User Profile
export const userProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ 
            message: "User profile retrieved", 
            data: user 
        });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Update User Profile (Including Profile Picture)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, mobile, address } = req.body;
        let updateFields = { name, email, mobile, address };

        // ✅ Handle Profile Picture Update
        if (req.file) {
            const newProfilePic = `uploads/${req.file.filename}`;

            // ✅ Get User Data to Remove Old Image
            const user = await User.findById(userId);
            if (user.profilePic && user.profilePic !== "https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png") {
                const oldImagePath = path.join("uploads", path.basename(user.profilePic));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // ✅ Delete old profile pic
                }
            }
            updateFields.profilePic = newProfilePic;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

        res.json({ 
            message: "Profile updated successfully", 
            data: updatedUser 
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ User Logout
export const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
