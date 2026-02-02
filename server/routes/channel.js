import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createChannel, getMyChannel } from "../controllers/Channel.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/", authMiddleware, createChannel);
router.get("/me", authMiddleware, getMyChannel);

export default router;
