import express from "express";
import geoip from "geoip-lite";
import Comment from "../Modals/comment.js";
import {
  postcomment,
  getallcomment,
  editcomment,
  translateComment,
  dislikeComment,
} from "../controllers/comment.js";

const router = express.Router();

router.post("/postcomment", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const geo = geoip.lookup(ip);
  req.body.city = geo?.city || "Unknown";

  postcomment(req, res);
});

router.put("/edit/:id", editcomment);
router.put("/dislike/:id", dislikeComment);
router.post("/translate", translateComment);
router.get("/:videoid", getallcomment);

export default router;

// import express from "express";
// import {
//   deletecomment,
//   getallcomment,
//   postcomment,
//   editcomment,
//   translateComment,
//   dislikeComment,
// } from "../controllers/comment.js";
// import Comment from "../Modals/comment.js";
// import geoip from "geoip-lite";

// const router = express.Router();

// // POST COMMENT WITH CITY
// router.post("/postcomment", async (req, res) => {
//   try {
//     const ip =
//       req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

//     const geo = geoip.lookup(ip);
//     const city = geo?.city || "Unknown";

//     const comment = await Comment.create({
//       videoid: req.body.videoid,
//       userid: req.body.userid,
//       commentbody: req.body.commentbody,
//       usercommented: req.body.usercommented || "Unknown User",
//       city: city,
//     });

//     res.json({ comment });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error posting comment" });
//   }
// });

// // DELETE COMMENT
// router.delete("/deletecomment/:id", deletecomment);

// // EDIT COMMENT
// router.put("/edit/:id", async (req, res) => {
//   try {
//     const updated = await Comment.findByIdAndUpdate(
//       req.params.id,
//       { commentbody: req.body.commentbody },
//       { new: true },
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update" });
//   }
// });

// // TRANSLATE COMMENT
// router.post("/translate", translateComment);

// router.put("/dislike/:id", dislikeComment);

// // GET ALL COMMENTS
// router.get("/:videoid", getallcomment);

// export default router;
