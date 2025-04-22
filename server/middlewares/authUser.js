import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//  Load environment variables
dotenv.config();

//  Ensure JWT_SECRET_KEY is defined
if (!process.env.JWT_SECRET_KEY) {
    console.error(" Fatal Error: JWT_SECRET_KEY is missing in .env file");
    process.exit(1); // Stop the server if the key is missing
}

// Authentication Middleware
export const authUser = (req, res, next) => {
    try {
        let token = req.cookies?.jwt; //  Use 'jwt' cookie key for consistency
        console.log("🔹 Token from Cookie:", token);

        // Fallback: Authorization Header
        if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            console.log("🔹 Token from Authorization Header:", token);
        }

        //  If still no token, deny access
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);

                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired, please log in again" });
                }

                return res.status(401).json({ message: "Invalid token" });
            }

            //  Attach user info to req
            if (!decoded.id || !decoded.role) {
                return res.status(401).json({ message: "Invalid token payload" });
            }

            req.user = {
                id: decoded.id,
                role: decoded.role,
            };

            console.log("Authenticated User:", req.user);
            next();
        });
    } catch (error) {
        console.error(" Unexpected JWT Middleware Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
