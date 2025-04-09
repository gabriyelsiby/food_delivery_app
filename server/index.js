import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// ✅ Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Get allowed origins from .env and convert to array
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

// ✅ CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required for sending cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Serve Static Files (e.g., uploaded images)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ✅ API Routes
app.use("/api", apiRouter);

// ✅ Catch All Unknown Routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "❌ Endpoint does not exist" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
