import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5003;

app.use(
  cors({
    origin: "http://localhost:5173", // or "*" if for testing
    credentials: true,
    exposedHeaders: ["token"], // 👈 VERY IMPORTANT
  })
);
app.use(express.json());

app.use("/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Save messages to a local JSON file
const saveMessageToFile = ({ name, email, message }) => {
  const filePath = path.join(__dirname, "messages.json");
  const existing = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];
  existing.push({ name, email, message, date: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Test email route
app.get("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Test Sender" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "This is a test email from the /test-email endpoint.",
    });

    res.send("✅ Test email sent!");
  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Failed to send test email");
  }
});

// Contact form submission
app.post("/api/contact", async (req, res) => {
  const { name, email, message, token } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    // 1. Verify reCAPTCHA
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({ secret: secretKey, response: token }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { success } = response.data;
    if (!success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    // 2. Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Send email to yourself
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    // 4. Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting me!",
      text: `Hi ${name},\n\nThank you for reaching out. I have received your message and will get back to you shortly.\n\nBest regards,\nMila Amen`,
    });

    // 5. Save message to file
    saveMessageToFile({ name, email, message });

    // 6. Send response
    res.json({ message: "Message received and emails sent!" });
  } catch (error) {
    console.error("Error:", error.message || error);
    res.status(500).json({ error: "❌ Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
