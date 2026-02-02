import express from "express";
import geoip from "geoip-lite";
import {
  postcomment,
  getallcomment,
  editcomment,
  translateComment,
  dislikeComment,
} from "../controllers/comment.js";

const router = express.Router();

function getClientIp(req) {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.ip ||
    req.socket.remoteAddress;

  // IPv6-mapped IPv4 fix
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return ip;
}

router.post("/postcomment", async (req, res) => {
  const ip = getClientIp(req);

  let city = "Unknown";

  // Localhost handling (DEV only)
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip?.includes("127.0.0.1")
  ) {
    city = "Localhost";
  } else {
    const geo = geoip.lookup(ip);
    city = geo?.city || "Unknown";
  }

  req.body.city = city;

  postcomment(req, res);
});

router.put("/edit/:id", editcomment);
router.put("/dislike/:id", dislikeComment);
router.post("/translate", translateComment);
router.get("/:videoid", getallcomment);

export default router;

// import express from "express";
// import geoip from "geoip-lite";
// import Comment from "../models/comment.js";
// import {
//   postcomment,
//   getallcomment,
//   editcomment,
//   translateComment,
//   dislikeComment,
// } from "../controllers/comment.js";

// const router = express.Router();

// router.post("/postcomment", async (req, res) => {
//   const ip =
//     req.headers["x-forwarded-for"]?.split(",")[0] ||
//     req.socket.remoteAddress;

//   const geo = geoip.lookup(ip);
//   req.body.city = geo?.city || "Unknown";

//   postcomment(req, res);
// });

// router.put("/edit/:id", editcomment);
// router.put("/dislike/:id", dislikeComment);
// router.post("/translate", translateComment);
// router.get("/:videoid", getallcomment);

// export default router;
