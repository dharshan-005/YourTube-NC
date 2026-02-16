import Auth from "../models/Auth.js";

export const checkWatchLimit = async (req, res, next) => {
  const user = await Auth.findById(req.user.id);

  const limits = {
    FREE: 5,
    BRONZE: 7,
    SILVER: 10,
    GOLD: Infinity
  };

  const allowedMinutes = limits[user.subscription.plan];

  if (allowedMinutes !== Infinity) {
    if (req.body.watchTime > allowedMinutes * 60) {
      return res.status(403).json({
        message: "Watch limit exceeded. Please upgrade your plan."
      });
    }
  }

  next();
};
