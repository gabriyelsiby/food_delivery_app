import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "paypal", "upi", "cod"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);