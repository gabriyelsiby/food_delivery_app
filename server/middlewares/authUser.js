import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Ensure JWT_SECRET_KEY is defined
if (!process.env.JWT_SECRET_KEY) {
    console.error("❌ Fatal Error: JWT_SECRET_KEY is missing in .env file");
    process.exit(1); // Stop the server if the key is missing
}

export const authUser = (req, res, next) => {
    try {
        let token = req.cookies?.token; // ✅ First check for token in cookies
        console.log("🔹 Token from Cookie:", token);

        // ✅ Fallback to Authorization Header if token is missing in cookies
        if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            console.log("🔹 Token from Authorization Header:", token);
        }

        // ✅ If token is still missing, reject request
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // ✅ Verify JWT Token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("❌ JWT Verification Error:", err.message);

                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired, please log in again" });
                }

                return res.status(401).json({ message: "Invalid token" });
            }

            console.log("✅ Decoded Token:", decoded);

            // ✅ Ensure token has necessary data
            if (!decoded.id || !decoded.role) {
                return res.status(401).json({ message: "Invalid token payload" });
            }

            // ✅ Attach user data to request object
            req.user = { id: decoded.id, role: decoded.role };
            next();
        });
    } catch (error) {
        console.error("🔥 Unexpected JWT Middleware Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
