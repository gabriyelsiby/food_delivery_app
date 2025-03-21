import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Middleware (Fixed Configuration)
app.use(cors({
  origin: "http://localhost:5173", // ✅ Allow frontend requests
  credentials: true, // ✅ Allow cookies (important for authentication)
  methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allow API methods
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow necessary headers
}));

// ✅ Middleware
app.use(express.json()); // Parse JSON data
app.use(cookieParser()); // Enable cookie handling

// ✅ Register API routes
app.use("/api", apiRouter);

// ✅ Handle Invalid Routes
app.all("*", (req, res) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

// ✅ Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
