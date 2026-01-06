import video from "../Modals/video.js";
import history from "../Modals/history.js";

export const handlehistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;
  try {
    await history.create({ viewer: userId, videoid: videoId });
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ history: true });
  } catch (error) {
    console.error("History error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while processing history" });
  }
};
export const handleview = async (req, res) => {
  const { videoId } = req.params;
  try {
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  } catch (error) {
    console.error("View error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while processing view" });
  }
};
export const getallhistoryVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const historyvideo = await history
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .exec();
    return res.status(200).json(historyvideo);
  } catch (error) {
    console.error("Get all history videos error:", error);
    return res
      .status(500)
      .json({
        message: "Something went wrong while retrieving history videos",
      });
  }
};

export const getDownloadHistory = async (req, res) => {
  const user = await Auth.findById(req.user.id);
  res.json(user.downloadedVideos);
};
