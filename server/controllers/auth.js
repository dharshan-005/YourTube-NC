import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import users from "../models/Auth.js";
import Download from "../models/Download.js";

export const login = async (req, res) => {
  const { email, name, image } = req.body;

  try {
    let user = await users.findOne({ email });

    if (!user) {
      user = await users.create({ email, name, image });
    }

    // 🔑 CREATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id }, // MUST be "id"
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      result: user,
      token, // SEND TOKEN TO FRONTEND
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Something went wrong while logging in",
    });
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
