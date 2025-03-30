import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

// ✅ Apply CORS before any other middleware
app.use(
    cors({
        origin: ["http://localhost:5173", "https://food-delivery-app-clint.vercel.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
    res.send("Hello World!!!!!");
});

// API routes
app.use("/api", apiRouter);

// Handle unknown routes
app.all("*", (req, res) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});