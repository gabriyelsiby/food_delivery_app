import express from "express";
import serverless from "serverless-http";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://food-delivery-user-rho.vercel.app",
  "https://food-delivery-nd0dj6v25-gabriyel-sibys-projects-72d0d689.vercel.app",
  "https://foodey-express-client.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "❌ Endpoint does not exist" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server.",
    error: err.message,
  });
});

// ❌ REMOVE this part:
// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });

// ✅ ADD this instead:
export const handler = serverless(app);
