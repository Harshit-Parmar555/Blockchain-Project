import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

// AUTH ROUTE
export const authRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token not provided",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded || !decoded._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // Fetch user from database
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;
    return next(); // Move to the next middleware
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    // Handle JWT Expiration Error
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token expired",
      });
    }

    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
