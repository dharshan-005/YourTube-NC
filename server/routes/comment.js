import express from "express";
import {
  deletecomment,
  getallcomment,
  postcomment,
  editcomment,
  translateComment,
} from "../controllers/comment.js";
import Comment from "../Modals/comment.js";
import geoip from "geoip-lite";

const router = express.Router();

// POST COMMENT WITH CITY
router.post("/postcomment", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const geo = geoip.lookup(ip);
    const city = geo?.city || "Unknown";

    const comment = await Comment.create({
      videoid: req.body.videoid,
      userid: req.body.userid,
      commentbody: req.body.commentbody,
      usercommented: req.body.usercommented || "Unknown User",
      city: city,
    });

    res.json({ comment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error posting comment" });
  }
});

// DELETE COMMENT
router.delete("/deletecomment/:id", deletecomment);

// EDIT COMMENT
router.put("/edit/:id", async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { commentbody: req.body.commentbody },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// TRANSLATE COMMENT
router.post("/translate", translateComment);

// GET ALL COMMENTS
router.get("/:videoid", getallcomment);

export default router;


// import express from "express";
// import {
//   deletecomment,
//   getallcomment,
//   postcomment,
//   editcomment,
//   translateComment,
// } from "../controllers/comment.js";
// import geoip from "geoip-lite";

// const routes = express.Router();

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
//       usercommented: req.user?.name || "Unknown User",
//       city: city,
//     });

//     res.json({ comment });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error posting comment" });
//   }
// });

// routes.delete("/deletecomment/:id", deletecomment);
// // routes.post("/editcomment/:id", editcomment);
// router.put("/edit/:id", async (req, res) => {
//   try {
//     const updated = await Comment.findByIdAndUpdate(
//       req.params.id,
//       { commentbody: req.body.commentbody },
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update" });
//   }
// });

// routes.post("/translate", translateComment);
// routes.get("/:videoid", getallcomment);
// export default routes;
