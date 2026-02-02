import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", authMiddleware, createOrder);

// Verify payment & activate premium
router.post("/verify", authMiddleware, verifyPayment);

export default router;
