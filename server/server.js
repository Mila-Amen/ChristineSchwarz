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
import router from "./router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5003;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------- CORS ----------
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PROD_URL,
  "http://localhost:5173",
  "https://christineschwarz.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman/curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false); // <-- just reject, don't throw an error
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

// ---------- Middleware ----------
app.use(express.json());
app.use("/user", userRoutes);
app.use(require("./router"));

// ---------- Nodemailer ----------
const transporter = nodemailer.createTransport({
  host: "server1.s-tech.de",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// ---------- Contact Form ----------
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: "info@christineschwarz.life",
      subject: `New Contact Form Submission: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for your message!",
      text: `Hi ${name},\n\nThank you for contacting me. I’ll reply shortly.\n\nBest regards,\nChristine Schwarz`,
    });

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

// ---------- Subscribe ----------
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const filePath = path.join(__dirname, "subscribers.json");
  const subscribers = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  if (subscribers.includes(email))
    return res.status(400).json({ error: "Already subscribed." });

  try {
    subscribers.push(email);
    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));

    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: "info@christineschwarz.life",
      subject: "New Newsletter Subscription",
      text: `New subscriber: ${email}`,
    });

    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for subscribing!",
      text: `Hi,\n\nThank you for subscribing to our newsletter!\n\nBest regards,\nChristine Schwarz`,
    });

    res.json({ message: "Subscription received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ---------- Forgot & Reset Password ----------
app.post("/user/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Valid for 1 hour.</p>`,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
