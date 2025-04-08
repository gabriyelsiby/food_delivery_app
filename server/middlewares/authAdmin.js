import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Admin not authorized - no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || decoded.role !== "admin") {
      return res.status(401).json({ message: "Admin not authorized - invalid role" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("🔥 Admin Auth Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
