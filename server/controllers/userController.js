import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Generate token
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

// 📝 Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });

    res.json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔓 Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({ success: true, token, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Verify Token
export const verifyToken = (req, res) => {
  const token = req.headers.token;

  if (!token) return res.status(401).json({ success: false, message: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, data: decoded });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
