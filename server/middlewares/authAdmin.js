import jwt from 'jsonwebtoken';

// Middleware to check if the user is an admin
export const authAdmin = (req, res, next) => {
  try {
    // Get the token from the cookies
    const token = req.cookies?.jwt;

    if (!token) {
      console.error(" No token provided");
      return res.status(401).json({ message: " No token provided" });
    }

    // Check if JWT_SECRET_KEY is defined in environment variables
    if (!process.env.JWT_SECRET_KEY) {
      console.error(" JWT_SECRET_KEY is not defined in environment variables");
      return res.status(500).json({ message: " Server configuration error" });
    }

    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded Token:", decoded); // Debugging line to check decoded token

    // If decoded token doesn't exist or user is not an admin, deny access
    if (!decoded || decoded.role !== "admin") {
      console.error(" Access denied. Token role:", decoded?.role);
      return res.status(403).json({ message: " Access denied. Not an admin" });
    }

    // Attach user data to request object
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error(" Admin Auth Error:", error.message);

    // Handle token expiry
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: " Token has expired" });
    }

    return res.status(500).json({ message: " Internal server error" });
  }
};
