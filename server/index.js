import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to Database
connectDB();

// ✅ CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://food-delivery-app-clint.vercel.app",
    /https:\/\/food-delivery-app-clint.*\.vercel\.app$/ // Allows dynamic subdomains from Vercel
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.some((o) => o instanceof RegExp ? o.test(origin) : o === origin)) {
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

// ✅ Ensure CORS Headers Are Sent
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// ✅ API Routes
app.use("/api", apiRouter);

// ✅ Handle Unknown Routes
app.all("*", (req, res) => {
    res.status(404).json({ message: "❌ Endpoint does not exist" });
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
