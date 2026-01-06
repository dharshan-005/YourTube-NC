import Auth from "../Modals/Auth.js";
import path from "path";
import fs from "fs";

import video from "../Modals/video.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "plz upload a mp4 video file only" });
  } else {
    try {
      const file = new video({
        videotitle: req.body.videotitle,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        videochanel: req.body.videochanel,
        uploader: req.body.uploader,
      });
      await file.save();
      return res.status(201).json("file uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Something went wrong while uploading the video" });
    }
  }
};
export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    console.error("Retrieval error:", error);
    return res.status(500).json({ message: "Something went wrong with the video retrieval" });
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
      return res.status(404).json({ message: "Video file not found on server" });
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
