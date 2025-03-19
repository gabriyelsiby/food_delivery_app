import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
    try {
        return jwt.sign(
            { id, role }, 
            process.env.JWT_SECRET_KEY,  
            { expiresIn: "7d" } 
        );
    } catch (error) {
        console.error("JWT Token Error:", error);
        return null;  
    }
};
