import comment from "../Modals/comment.js";
import mongoose from "mongoose";
import axios from "axios";

export const postcomment = async (req, res) => {
  const commentdata = req.body;

  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (ip === "::1" || ip === "127.0.0.1") {
    ip = "8.8.8.8"; // Test IP
  }

  let city = "Unknown";
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const info = await response.json();
    if (info && info.city) city = info.city;
  } catch (err) {
    console.log("City fetch failed:", err);
  }

  // 🔥 GET USER NAME
  const userModel = mongoose.model("user");
  const userInfo = await userModel.findById(commentdata.userid);

  const newComment = new comment({
    ...commentdata,
    usercommented: userInfo?.username || userInfo?.name || "User",
    city,
  });

  try {
    const saved = await newComment.save();

    return res.status(200).json({
      success: true,
      comment: saved,
      city,
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    const commentvideo = await comment.find({ videoid: videoid });
    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    await comment.findByIdAndDelete(_id);
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    const updatecomment = await comment.findByIdAndUpdate(_id, {
      $set: { commentbody: commentbody },
    });
    res.status(200).json(updatecomment);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Translate Comment

export const translateComment = async (req, res) => {
  const { commentText, targetLanguage } = req.body;

  if (!commentText || !targetLanguage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: commentText,
          // source: "en",
          // target: targetLanguage,
          // format: "text",
          langpair: `en|${targetLanguage}`,
        },
      }
    );
    const translated = response.data.responseData.translatedText;
    return res.status(200).json({ translatedText: translated });
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Translation failed" });
  }
};

// Dislike Comment Functionality

export const dislikeComment = async (req, res) => {
  const { id } = req.params;

  try {
    const cmnt = await comment.findById(id);
    if (!cmnt) return res.status(404).json({ message: "Comment not found" });

    cmnt.dislikes += 1;

    if (cmnt.dislikes >= 2) {
      await comment.findByIdAndDelete(id);
      return res.status(200).json({ deleted: true });
    }

    await cmnt.save();
    return res.status(200).json({ dislikes: cmnt.dislikes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
