import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      console.error("❌ No token provided");
      return res.status(401).json({ message: "❌ No token provided" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error("❌ JWT_SECRET_KEY is not defined in environment variables");
      return res.status(500).json({ message: "❌ Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || decoded.role !== "admin") {
      console.error("❌ Access denied. Token role:", decoded?.role);
      return res.status(403).json({ message: "❌ Access denied. Not an admin" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("🔥 Admin Auth Error:", error.message);
    return res.status(500).json({ message: "🔥 Internal server error" });
  }
};
