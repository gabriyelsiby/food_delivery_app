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

// ✅ Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://food-delivery-user-rho.vercel.app",
  "https://food-delivery-nd0dj6v25-gabriyel-sibys-projects-72d0d689.vercel.app",
];

// ✅ CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Serve Static Files (e.g., uploaded images) - with full URL support
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
