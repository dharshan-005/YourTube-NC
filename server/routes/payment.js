import express from "express";
// import { createOrder, verifyPayment } from "../controllers/payment.js";
import { mockPremiumPayment } from "../controllers/payment.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// // Create Razorpay order
// router.post("/create-order", authMiddleware, createOrder);

// // Verify payment & activate premium
// router.post("/verify", authMiddleware, verifyPayment);

// Mock data for razorPay
router.post("/mock-success", authMiddleware, mockPremiumPayment);

export default router;
