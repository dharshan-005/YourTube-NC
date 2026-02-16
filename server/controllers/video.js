import Auth from "../models/Auth.js";
import path from "path";
import fs from "fs";

import video from "../models/video.js";

export const uploadvideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a video file" });
  }

  try {
    const newVideo = new video({
      videotitle: req.body.videotitle,
      filename: req.file.originalname,
      filepath: req.file.path,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      videochanel: req.body.videochanel || "",
      uploader: req.user.id, // ✅ FROM JWT (IMPORTANT)
    });

    await newVideo.save();
    return res.status(201).json(newVideo);
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Video upload failed" });
  }
};

export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    console.error("Retrieval error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong with the video retrieval" });
  }
};

export const downloadVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.videoId;

    const user = await Auth.findById(userId);
    const file = await video.findById(videoId);

    if (!user || !file) {
      return res.status(404).json({ message: "User or video not found" });
    }

    // ---- Daily limit logic ----
    const today = new Date().toDateString();

    if (user.lastDownloadDate?.toDateString() !== today) {
      user.downloadsToday = 0;
    }

    if (!user.isPremium && user.downloadsToday >= 1) {
      return res.status(403).json({
        message: "Daily download limit reached. Upgrade to Premium.",
      });
    }

    // ---- File exists check ----
    if (!fs.existsSync(file.filepath)) {
      return res
        .status(404)
        .json({ message: "Video file not found on server" });
    }

    // ---- Update user download data ----
    user.downloadsToday += 1;
    user.lastDownloadDate = new Date();

    user.downloadedVideos.push({
      videoId: file._id,
      title: file.videotitle,
      thumbnail: "", // optional
      downloadedAt: new Date(),
    });

    await user.save();

    // ---- Send file for download ----
    res.download(file.filepath, file.filename);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Video download failed" });
  }
};

export const getVideosByUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("VIDEO MODEL:", video);

    const videos = await video
      .find({ uploader: id })
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Get videos by user error:", error);
    res.status(500).json({ message: "Failed to fetch user videos" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;

    const file = await video.findById(videoId);
    const user = await Auth.findById(req.user.id);

    if (!file) {
      return res.status(404).json({ message: "Video not found" });
    }

    // ---- Plan Limits ----
    const limits = {
      FREE: 5,
      BRONZE: 7,
      SILVER: 10,
      GOLD: Infinity,
    };

    const userPlan = user?.subscription?.plan || "FREE";
    const allowedMinutes = limits[userPlan];

    return res.status(200).json({
      video: file,
      allowedMinutes,
    });

  } catch (error) {
    console.error("Watch video error:", error);
    res.status(500).json({ message: "Failed to fetch video" });
  }
};

