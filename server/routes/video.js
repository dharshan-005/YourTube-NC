import express from "express";
import {
  getallvideo,
  uploadvideo,
  downloadVideo,
  getVideosByUser,
  getVideoById,
} from "../controllers/video.js";

import upload from "../filehelper/filehelper.js";
import authMiddleware from "../middleware/auth.js";

const routes = express.Router();

routes.post("/upload", authMiddleware, upload.single("file"), uploadvideo);
routes.get("/download/:videoId", authMiddleware, downloadVideo);
routes.get("/getall", getallvideo);

routes.get("/user/:id", getVideosByUser);
routes.get("/watch/:id", authMiddleware, getVideoById);

export default routes;
