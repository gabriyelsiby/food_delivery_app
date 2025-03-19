import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅= Connect to MongoDB
connectDB();

//  Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//  Register API routes
app.use("/api", apiRouter);

// Catch invalid routes
app.all("*", (req, res) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
