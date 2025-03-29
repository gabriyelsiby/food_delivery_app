import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxLength: 50 },
        email: { type: String, required: true, unique: true, minLength: 3, maxLength: 30 },
        password: { type: String, required: true, minLength: 6 },
        mobile: { type: String, required: true },
        role: { 
            type: String, 
            enum: ["user", "admin", "restaurant", "deliveryPartner"],  
            default: "user"  
        },
        profilePic: {
            type: String,
            default: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png", 
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
