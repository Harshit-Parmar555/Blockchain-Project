import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

// REGISTER CONTROLLER
export const register = async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;
    if (!username || !email || !password || !walletAddress) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const userExisted = await userModel.findOne({ email });
    if (userExisted) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      walletAddress,
    });

    await newUser.save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: { username, email, walletAddress }, // Returning user without password
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all credentials",
      });
    }

    let user = await userModel.findOne({ email }).select("+password"); // Ensure password is fetched
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// LOGOUT CONTROLLER
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// CHECKAUTH CONTROLLER
export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: No user found",
      });
    }

    return res.status(200).send({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
