import express from "express"
import { login, updateprofile, getUserById } from "../controllers/auth.js"

const routes = express.Router()

routes.post('/login', login)
routes.patch("/update/:id",updateprofile)
routes.get("/:id", getUserById);

// routes.post('/verify-otp', verifyOtp);

export default routes