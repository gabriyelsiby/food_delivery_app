import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Check for token in cookies if not found in Authorization header
    if (!token && req.cookies) {
      token = req.cookies.token;
    }

    if (!token) {
      console.error(" Authentication Error: Token from Cookie or Header is undefined");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    console.log(`ℹ️ Token Retrieved: ${token}`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.error("Authentication Error: User not found for token");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(" Authentication Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
