import mongoose, { Schema } from "mongoose";

const deliveryPartnerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        mobile: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: "https://example.com/default-delivery-partner.jpg",
        },
        vehicleType: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        currentLocation: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);