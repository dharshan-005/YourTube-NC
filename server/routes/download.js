import express from "express";
import { downloadVideo } from "../controllers/download.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/:videoId", authMiddleware, downloadVideo);

export default router;
