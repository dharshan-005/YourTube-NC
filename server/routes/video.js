import express from "express";

import { getallvideo, uploadvideo, downloadVideo } from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";
import authMiddleware from "../middleware/auth.js";

const routes = express.Router();

routes.post("/upload", upload.single("file"), uploadvideo);
routes.get("/download/:videoId", authMiddleware, downloadVideo);
routes.get("/getall", getallvideo);
export default routes;