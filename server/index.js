import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://food-delivery-user-rho.vercel.app",
  "https://food-delivery-nd0dj6v25-gabriyel-sibys-projects-72d0d689.vercel.app",
  "https://foodey-express-client.vercel.app",
  "https://foodey-express-client-1qs17jmqz.vercel.app"
];

// CORS: Allow requests only from approved frontends
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked CORS request from: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Serve Uploaded Files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Root Test Route
app.get("/", (req, res) => {
  res.send("🚀 API Server is running!");
});

// API Routes
app.use("/api", apiRouter);

// Catch 404s
app.all("*", (req, res) => {
  res.status(404).json({ message: "❌ Endpoint does not exist" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server.",
    error: err.message,
  });
});

// Start Express Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
