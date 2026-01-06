import express from "express";
import {
  getallhistoryVideo,
  getDownloadHistory,
  handlehistory,
  handleview,
} from "../controllers/history.js";
import authMiddleware from "../middleware/auth.js";

const routes = express.Router();
routes.get("/:userId", getallhistoryVideo);
routes.get("/downloads", authMiddleware, getDownloadHistory);
routes.post("/views/:videoId", handleview);
routes.post("/:videoId", handlehistory);
export default routes;