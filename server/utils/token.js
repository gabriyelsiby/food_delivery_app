import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
    try {
        return jwt.sign(
            { id, role }, 
            process.env.JWT_SECRET_KEY,  // ✅ Ensure this key is set in .env
            { expiresIn: "7d" } // ✅ Token expires in 7 days
        );
    } catch (error) {
        console.error("JWT Token Error:", error);
        return null;  // ✅ Return null if token generation fails
    }
};
