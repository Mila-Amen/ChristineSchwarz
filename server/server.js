// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------- CORS ----------
const allowedOrigins = [
  process.env.CLIENT_URL, // e.g., "http://192.168.178.87:5173"
  process.env.PROD_URL, // e.g., "https://christineschwarz.life"
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS not allowed for this origin"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ---------- Middleware ----------
app.use(express.json());
app.use("/user", userRoutes);

// ---------- __dirname for file paths ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------- Helpers ----------
const saveMessageToFile = ({ name, email, message }) => {
  const filePath = path.join(__dirname, "messages.json");
  const existing = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];
  existing.push({ name, email, message, date: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
};

// ---------- Nodemailer Transporter ----------
/* const createTransporter = () => {
  return nodemailer.createTransport({
    host: "server1.s-tech.de", // this works for your host
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // ignore domain/cert mismatch
    },
  });
}; */
// ---------- Nodemailer Transporter ----------
const transporter = nodemailer.createTransport({
  host: "server1.s-tech.de",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true,
});

// ---------- Contact Form ----------
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "server1.s-tech.de",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
      logger: true,
      debug: true,
    });

    // Email to admin
    await transporter.sendMail({
      from: '"Christine Schwarz" <info@christineschwarz.life>',
      to: ["info@christineschwarz.life"],
      subject: `New Contact Form Submission: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for your message!",
      text: `Hi ${name},\n\nThank you for contacting me. I’ve received your message and will reply shortly.\n\nBest regards,\nChristine Schwarz`,
    });

    // Optional: save messages to JSON
    const filePath = path.join(__dirname, "messages.json");
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
    existing.push({ name, email, subject, message, date: new Date() });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    res.json({ message: "✅ Message sent successfully!" });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({ error: "Server error: Email not sent" });
  }
});
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  const filePath = path.join(__dirname, "subscribers.json");
  const subscribers = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  // Check if already subscribed
  if (subscribers.includes(email)) {
    return res.status(400).json({ error: "This email is already subscribed." });
  }

  try {
    subscribers.push(email);
    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));
    
    await transporter.sendMail({
      from: `"Christine Schwarz" <info@christineschwarz.life>`,
      to: "info@christineschwarz.life",
      subject: "New Newsletter Subscription",
      text: `New subscriber: ${email}`,
    });
    await transporter.sendMail({
      from: `"Christine Schwarz" <info@christineschwarz.life>`,
      to: email,
      subject: "Thank you for subscribing!",
      text: `Hi,\n\nThank you for subscribing to our newsletter! We’ll keep you updated with the latest news and offers.\n\nBest regards,\nChristine Schwarz`,
    });

    res.json({ message: "Subscription received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Forgot Password
app.post("/user/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expire = Date.now() + 3600 * 1000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expire;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Christine Schwarz" <info@christineschwarz.life>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Hi,</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
app.post("/user/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
