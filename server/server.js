import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";

dotenv.config();
console.clear();
const app = express();

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

const PORT = process.env.PORT || 5003;

app.use(express.json());
app.use(express.static("views"));
app.use("/user", userRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.sendFile("./views/index.html", {
    root: ".",
  });
});

// ---------- CORS ----------
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PROD_URL,
  "http://localhost:5173",
  "https://christineschwarz.onrender.com",
];

// ---------- Middleware ----------

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



// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
