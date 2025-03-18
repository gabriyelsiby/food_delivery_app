import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
}, { timestamps: true });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
