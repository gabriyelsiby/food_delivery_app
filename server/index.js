import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/apiRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173", "https://food-delivery-app-clint.vercel.app/"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
    })
);

app.get("/", (req, res) => {
    res.send("Hello World!!!!!");
});

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

// ❌ Remove app.listen(port)
// ✅ Export app as default for Vercel
export default app;
