import Auth from "../models/Auth.js";
import Download from "../models/Download.js";

export const downloadVideo = async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.params;

  const user = await Auth.findById(userId);

  const today = new Date().toDateString();
  const last = user.lastDownloadDate?.toDateString();

  if (today !== last) {
    user.downloadsToday = 0;
  }

  if (!user.isPremium && user.downloadsToday >= 1) {
    return res.status(403).json({
      message: "Daily limit reached. Upgrade to premium.",
    });
  }

  user.downloadsToday += 1;
  user.lastDownloadDate = new Date();
  await user.save();

  await Download.create({
    userId: user._id,
    videoId,
  });

  res.json({ message: "Download allowed" });
};
