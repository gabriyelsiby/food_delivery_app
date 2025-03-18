import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxLength: 50 },
        email: { type: String, required: true, unique: true, minLength: 3, maxLength: 30 },
        password: { type: String, required: true, minLength: 6 },
        mobile: { type: String, required: true },
        address: { type: String, required: true },
        role: { 
            type: String, 
            enum: ["user", "admin", "restaurant", "deliveryPartner"],  // ✅ Add roles
            default: "user"  
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
