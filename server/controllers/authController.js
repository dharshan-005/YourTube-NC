import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";
import Auth from "../models/Auth.js";

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    // 🔥 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { email, name, picture } = decoded;

    // Check if user exists
    let user = await Auth.findOne({ email });

    if (!user) {
      user = await Auth.create({
        email,
        name,
        image: picture,
      });
    }

    // 🔥 Generate backend JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};
