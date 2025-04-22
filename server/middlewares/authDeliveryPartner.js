import jwt from "jsonwebtoken";

export const authDeliveryPartner = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Delivery partner not authorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodedToken || decodedToken.role !== "deliveryPartner") {
            return res.status(401).json({ message: "Delivery partner not authorized" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
