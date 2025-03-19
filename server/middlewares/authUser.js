import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    try {
        let token = req.cookies.token;  

        // Fallback to Authorization Header if token is missing in cookies
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        //  Check if token exists
        if (!token) {
            return res.status(401).json({ message: "User not authorized, no token provided" });
        }

        //  Check if JWT_SECRET_KEY is set in .env
        if (!process.env.JWT_SECRET_KEY) {
            console.error("JWT_SECRET_KEY is missing in .env file");
            return res.status(500).json({ message: "Internal server error, missing JWT secret" });
        }

        // Verify JWT Token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = { id: decodedToken.id, role: decodedToken.role };  // Store role in req.user
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
