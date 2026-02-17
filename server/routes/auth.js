import express from "express";
import {
  login,
  updateprofile,
  getUserById,
  getCurrentUser,
  cancelPremium,
  verifyOtp,
  googleLogin,
} from "../controllers/auth.js";
import authMiddleware from "../middleware/auth.js";
import { getUserDownloads } from "../controllers/auth.js";

const routes = express.Router();

routes.post("/login", login);
routes.post("/google-login", googleLogin);
routes.patch("/update/:id", updateprofile);

routes.get("/me", authMiddleware, getCurrentUser);
routes.get("/downloads", authMiddleware, getUserDownloads);
routes.post("/cancel-premium", authMiddleware, cancelPremium);
routes.get("/:id", getUserById);

routes.post("/verify-otp", verifyOtp);

export default routes;
