import express from "express";
import User from "../models/User.js"; // You'll create this model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, address } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send token in header and user info in response
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token, // Add this
      data: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Verify token
router.get("/verifytoken", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ success: false, message: "Invalid token." });
  }
});

export default router;
