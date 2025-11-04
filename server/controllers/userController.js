import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Generate token
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

// 📝 Register
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, address } =
      req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        firstName: newUser.firstName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔓 Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Verify Token
export const verifyToken = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, data: decoded });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
 