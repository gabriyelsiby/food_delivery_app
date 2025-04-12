import jwt from "jsonwebtoken";

export const authRestaurant = (req, res, next) => {
    try {
        let token = req.cookies.jwt;  // ✅ Use correct cookie name

        // Fallback to Authorization header
        if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken || decodedToken.role !== "restaurant") {
            return res.status(403).json({ message: "Forbidden, not a restaurant user" });
        }

        req.user = { id: decodedToken.id, role: decodedToken.role };
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
