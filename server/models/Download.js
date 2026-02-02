import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  downloadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Download", downloadSchema);
