// import comment from "../Modals/comment.js";
// import mongoose from "mongoose";
// import axios from "axios";

// // =========================
// // SPECIAL CHARACTER CHECK
// // =========================
// // Allows only letters, numbers, space and simple punctuation
// const allowedRegex = /^[A-Za-z0-9\s.,!?'"()\-:;]+$/;


// // =========================
// // POST COMMENT
// // =========================
// export const postcomment = async (req, res) => {
//   const commentdata = req.body;

//   // 1) Validate special characters
//   if (!allowedRegex.test(commentdata.commentbody)) {
//     return res.status(400).json({
//       success: false,
//       message: "Special characters are not allowed in comments",
//     });
//   }

//   // 2) Get IP properly (works on Vercel)
//   let ip =
//     req.headers["x-real-ip"] ||
//     req.headers["x-forwarded-for"]?.split(",")[0] ||
//     req.connection?.remoteAddress ||
//     req.socket?.remoteAddress ||
//     req.ip;

//   // Localhost fallback
//   if (!ip || ip.includes("::1") || ip.includes("127.0.0.1")) {
//     ip = "8.8.8.8"; // fallback for testing
//   }

//   console.log("User IP:", ip);

//   // 3) Fetch city
//   let city = "Unknown";

//   try {
//     const response = await axios.get(`https://ipapi.co/${ip}/json/`);
//     if (response.data && response.data.city) city = response.data.city;
//   } catch (err) {
//     console.log("City fetch failed:", err.message);
//   }

//   // 4) Create comment
//   const newComment = new comment({
//     ...commentdata,
//     city,
//   });

//   try {
//     const saved = await newComment.save();

//     return res.status(200).json({
//       success: true,
//       comment: saved,
//       city,
//     });
//   } catch (error) {
//     console.error("Save error:", error);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong while saving the comment" });
//   }
// };


// // =========================
// // GET ALL COMMENTS
// // =========================
// export const getallcomment = async (req, res) => {
//   const { videoid } = req.params;
//   try {
//     const commentvideo = await comment.find({ videoid: videoid });
//     return res.status(200).json(commentvideo);
//   } catch (error) {
//     console.error("Retrieval error:", error);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong with the comment retrieval" });
//   }
// };


// // =========================
// // DELETE COMMENT
// // =========================
// export const deletecomment = async (req, res) => {
//   const { id: _id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(404).send("comment unavailable");
//   }
//   try {
//     await comment.findByIdAndDelete(_id);
//     return res.status(200).json({ comment: true });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong while deleting the comment" });
//   }
// };


// // =========================
// // EDIT COMMENT
// // =========================
// export const editcomment = async (req, res) => {
//   const { id: _id } = req.params;
//   const { commentbody } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(404).send("comment unavailable");
//   }

//   // Special char check again for edits
//   if (!allowedRegex.test(commentbody)) {
//     return res.status(400).json({
//       message: "Special characters not allowed in comments",
//     });
//   }

//   try {
//     const updated = await comment.findByIdAndUpdate(
//       _id,
//       { $set: { commentbody } },
//       { new: true }
//     );

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error("Edit error:", error);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong while editing the comment" });
//   }
// };

// // =========================
// // TRANSLATE COMMENT (AUTO DETECT LANGUAGE)
// // =========================
// export const translateComment = async (req, res) => {
//   const { commentText, targetLanguage } = req.body;

//   if (!commentText || !targetLanguage) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Detect language using LibreTranslate
//     const detectRes = await axios.post("https://libretranslate.de/detect", {
//       q: commentText,
//     });

//     const detectedLanguage = detectRes.data[0]?.language;

//     if (!detectedLanguage) {
//       return res.status(500).json({ message: "Language detection failed" });
//     }

//     console.log("Detected:", detectedLanguage);

//     // Now call MyMemory with correct langpair
//     const translationRes = await axios.get(
//       "https://api.mymemory.translated.net/get",
//       {
//         params: {
//           q: commentText,
//           langpair: `${detectedLanguage}|${targetLanguage}`,
//         },
//       }
//     );

//     const translated = translationRes.data.responseData.translatedText;

//     return res.status(200).json({ translatedText: translated });
//   } catch (error) {
//     console.error("Translation error:", error.message);
//     return res.status(500).json({ message: "Translation failed" });
//   }
// };



// // =========================
// // DISLIKE COMMENT (AUTO-DELETE)
// // =========================
// export const dislikeComment = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const cmnt = await comment.findById(id);
//     if (!cmnt) return res.status(404).json({ message: "Comment not found" });

//     cmnt.dislikes += 1;

//     // auto-delete after 2 dislikes
//     if (cmnt.dislikes >= 2) {
//       await comment.findByIdAndDelete(id);
//       return res.status(200).json({ deleted: true });
//     }

//     await cmnt.save();
//     return res.status(200).json({ dislikes: cmnt.dislikes });
//   } catch (error) {
//     console.error("Dislike error:", error);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong while disliking the comment" });
//   }
// };


import comment from "../Modals/comment.js";
import mongoose from "mongoose";
import axios from "axios";

export const postcomment = async (req, res) => {
  const commentdata = req.body;

  let ip =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip;

  if (!ip || ip.includes("::1") || ip.includes("127.0.0.1")) {
    ip = "8.8.8.8"; // fallback for localhost
  }

  console.log("User IP:", ip);

  let city = "Unknown";

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    if (data && data.city) city = data.city;
  } catch (err) {
    console.log("City fetch failed:", err);
  }

  const newComment = new comment({
    ...commentdata,
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
    console.error("Save error:", error);
    return res.status(500).json({ message: "Something went wrong while saving the comment" });
  }
};

export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    const commentvideo = await comment.find({ videoid: videoid });
    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error("Retrieval error:", error);
    return res.status(500).json({ message: "Something went wrong with the comment retrieval" });
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
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Something went wrong while deleting the comment" });
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
    console.error("Edit error:", error);
    return res.status(500).json({ message: "Something went wrong while editing the comment" });
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
    console.error("Dislike error:", error);
    return res.status(500).json({ message: "Something went wrong while disliking the comment" });
  }
};
