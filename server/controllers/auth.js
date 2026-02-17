import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import geoip from "geoip-lite";

import users from "../models/Auth.js";
import Download from "../models/Download.js";
import Otp from "../models/Otp.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendSms } from "../utils/sendSms.js";

/* =========================================================
   LOGIN CONTROLLER (MODIFIED WITH THEME + OTP LOGIC)
========================================================= */

export const login = async (req, res) => {
  const { email, name, image, phone } = req.body;

  try {
    /* ==============================
       1️⃣ FIND OR CREATE USER
    ============================== */

    let user = await users.findOne({ email });

    if (!user) {
      user = await users.create({ email, name, image });
    }

    /* ==============================
       2️⃣ DETECT LOCATION FROM IP
    ============================== */

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const stateMap = {
      TN: "Tamil Nadu",
      KL: "Kerala",
      KA: "Karnataka",
      AP: "Andhra Pradesh",
      TS: "Telangana",
    };

    const geo = geoip.lookup(ip);
    const stateCode = geo?.region;
    // const stateCode = "TN"

    const locationState = stateMap[stateCode] || "Other";

    /* ==============================
       3️⃣ THEME LOGIC
       White only if:
       - Southern state
       - Time between 10 AM - 12 PM
    ============================== */

    const southernStates = [
      "Tamil Nadu",
      "Kerala",
      "Karnataka",
      "Andhra Pradesh",
      "Telangana",
    ];

    // const hour = new Date().getHours();
    const indianTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const hour = new Date(indianTime).getHours();

    const isSouth = southernStates.includes(locationState);
    const isTimeValid = hour >= 10 && hour < 12;

    const theme = isSouth && isTimeValid ? "light" : "dark";

    /* ==============================
    4️⃣ OTP METHOD DECISION
    ============================== */

    const otpMethod = isSouth ? "email" : "sms";

    /* ==============================
    5️⃣ GENERATE OTP
    ============================== */

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let identifier;

    if (otpMethod === "email") {
      identifier = email;
    } else {
      if (!phone) {
        return res.status(400).json({
          message: "Phone number required for SMS OTP",
        });
      }
      identifier = phone;
    }

    await Otp.deleteMany({ identifier });

    const newOtp = await Otp.create({
      identifier,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("OTP saved:", newOtp);

    // await Otp.create({
    //   identifier,
    //   otp,
    //   expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    // });

    /* ==============================
       6️⃣ SEND OTP
    ============================== */

    if (otpMethod === "email") {
      await sendEmail(identifier, otp);
    } else {
      await sendSms(identifier, otp);
    }

    /* ==============================
       7️⃣ CREATE JWT TOKEN
    ============================== */

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    console.log("IP:", ip);
    console.log("Geo:", geo);
    console.log("Location State:", locationState);
    console.log("Hour:", hour);
    console.log("Theme decided:", theme);

    /* ==============================
       8️⃣ RETURN RESPONSE
    ============================== */

    return res.status(200).json({
      message: "OTP sent successfully",
      result: user,
      // token,
      locationState,
      theme,
      otpMethod,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Something went wrong while logging in",
    });
  }
};

export const googleLogin = async (req, res) => {
  const { email, name, image } = req.body;

  try {
    let user = await users.findOne({ email });

    if (!user) {
      user = await users.create({ email, name, image });
    }

    /* ========= LOCATION + THEME LOGIC ========= */

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const stateCode = geo?.region;
    // const stateCode = "TN";

    const stateMap = {
      TN: "Tamil Nadu",
      KL: "Kerala",
      KA: "Karnataka",
      AP: "Andhra Pradesh",
      TS: "Telangana",
    };

    const locationState = stateMap[stateCode] || "Other";

    const southernStates = [
      "Tamil Nadu",
      "Kerala",
      "Karnataka",
      "Andhra Pradesh",
      "Telangana",
    ];

    const hour = Number(new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }));

    const isSouth = southernStates.includes(locationState);
    const isTimeValid = hour >= 10 && hour < 12;

    const theme = isSouth && isTimeValid ? "light" : "dark";

    /* ========= CREATE TOKEN ========= */

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("IP:", ip);
    console.log("Geo:", geo);
    console.log("Location State:", locationState);
    console.log("Hour:", hour);
    console.log("Theme decided:", theme);

    return res.status(200).json({
      message: "Google login successful",
      result: user,
      token,
      locationState,
      theme,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      message: "Google login failed",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, phone, otp } = req.body;

  try {
    const identifier = phone || email;

    if (!identifier || !otp) {
      return res.status(400).json({
        message: "Identifier and OTP required",
      });
    }

    console.log("Incoming body:", req.body);
    console.log("Searching with identifier:", identifier);
    console.log("Searching with otp:", otp.toString());

    const record = await Otp.findOne({
      identifier,
      otp: otp.toString(),
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await Otp.deleteMany({ identifier });

    // IMPORTANT: user identity is email
    const user =
      (await users.findOne({ email })) || (await users.findOne({ phone }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      result: user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }
  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname: channelname,
          description: description,
        },
      },
      { new: true },
    );
    return res.status(201).json(updatedata);
  } catch (error) {
    console.error("Update profile error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while updating the profile" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await users.findById(req.params.id);

    if (!user || !user.channelname) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch channel" });
  }
};

export const getUserDownloads = async (req, res) => {
  try {
    const downloads = await Download.find({
      userId: req.user.id,
    })
      .populate("videoId", "videotitle filepath filename createdAt")
      .sort({ downloadedAt: -1 });

    return res.status(200).json(downloads);
  } catch (error) {
    console.error("Fetch downloads error:", error);
    return res.status(500).json({
      message: "Failed to fetch downloads",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await users.findById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const cancelPremium = async (req, res) => {
  try {
    const user = await users.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isPremium = false;
    user.downloadsToday = 0;
    user.lastDownloadDate = null;

    await user.save();

    return res.status(200).json({
      message: "Premium cancelled (dev mode)",
      user,
    });
  } catch (error) {
    console.error("Cancel premium error:", error);
    return res.status(500).json({ message: "Failed to cancel premium" });
  }
};

// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import users from "../models/Auth.js";
// import Download from "../models/Download.js";

// export const login = async (req, res) => {
//   const { email, name, image } = req.body;

//   try {
//     let user = await users.findOne({ email });

//     if (!user) {
//       user = await users.create({ email, name, image });
//     }

//     // 🔑 CREATE JWT TOKEN
//     const token = jwt.sign(
//       { id: user._id }, // MUST be "id"
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" },
//     );

//     return res.status(200).json({
//       result: user,
//       token, // SEND TOKEN TO FRONTEND
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       message: "Something went wrong while logging in",
//     });
//   }
// };
