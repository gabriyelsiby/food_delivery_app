import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Admin not authorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodedToken || decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Admin not authorized" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
