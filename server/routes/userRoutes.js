// server/routes/userRoutes.js
import express from "express";
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "User route works!" });
});

export default router; // ✅ Make it a default export
