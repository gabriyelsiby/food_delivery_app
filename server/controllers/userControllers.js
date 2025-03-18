import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

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
            role: role || "user"
        });

        await newUser.save();
        const token = generateToken(newUser._id, newUser.role);

        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }

        // ✅ Store token in cookies (Use secure: false for localhost)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  // ✅ Change to true only in production (HTTPS)
            sameSite: "Lax"
        });

        res.status(201).json({ 
            message: "Signup successful", 
            data: { name: newUser.name, email: newUser.email, role: newUser.role } 
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ User Login (Stores JWT in Cookies)
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

        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }

        // ✅ Store token in cookies (Use secure: false for localhost)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,  // ✅ Change to true only in production (HTTPS)
            sameSite: "Lax"
        });

        res.json({ 
            message: "Login successful", 
            data: { name: user.name, email: user.email, role: user.role } 
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
            data: { 
                name: user.name, 
                email: user.email, 
                role: user.role,
                mobile: user.mobile,
                address: user.address
            } 
        });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, mobile, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, mobile, address },
            { new: true }
        ).select("-password");

        res.json({ 
            message: "Profile updated successfully", 
            data: updatedUser 
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ User Logout (Clears Token)
export const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Export All Controllers
