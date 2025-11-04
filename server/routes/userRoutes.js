 import express from "express";
import { registerUser, loginUser, verifyToken } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verifytoken", verifyToken);

export default router;
 