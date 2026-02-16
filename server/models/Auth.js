import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  channelname: { type: String },
  description: { type: String },

  isPremium: {
    type: Boolean,
    default: false,
  },

  downloadsToday: {
    type: Number,
    default: 0,
  },

  lastDownloadDate: {
    type: Date,
  },

  downloadedVideos: [
    {
      videoId: mongoose.Schema.Types.ObjectId,
      title: String,
      thumbnail: String,
      downloadedAt: Date,
    },
  ],
  
  subscription: {
    plan: {
      type: String,
      enum: ["FREE", "BRONZE", "SILVER", "GOLD"],
      default: "FREE",
    },
    validTill: {
      type: Date,
    },
  },
});

export default mongoose.model("user", userSchema);
