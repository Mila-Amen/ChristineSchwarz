import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ---------- CORS ----------
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.PROD_URL,
  "https://christineschwarz.onrender.com",
  "http://localhost:5173",
  "http://localhost:5003"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman/curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS not allowed for this origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ---------- Middleware ----------
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------- Nodemailer ----------
const transporter = nodemailer.createTransport({
  host: "server1.s-tech.de",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

transporter.verify(err => {
  if (err) console.error("❌ Mail server connection failed:", err);
  else console.log("✅ Mail server ready");
});

// ---------- Contact Form ----------
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    // Admin email
    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: "info@christineschwarz.life",
      subject: `New Contact: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`
    });

    // Confirmation email
    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for your message!",
      text: `Hi ${name},\n\nThanks for contacting me.\n\nBest regards,\nChristine Schwarz`
    });

    // Save messages (optional)
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
      subject: "New Subscription",
      text: `New subscriber: ${email}`
    });

    await transporter.sendMail({
      from: `"Christine Schwarz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for subscribing!",
      text: `Hi,\n\nThanks for subscribing!\n\nBest regards,\nChristine Schwarz`
    });

    res.json({ message: "✅ Subscription received" });
  } catch (err) {
    console.error("❌ Subscribe error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Serve React frontend ----------
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// ---------- Start server ----------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
