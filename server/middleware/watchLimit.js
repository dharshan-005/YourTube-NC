const planLimits = {
  FREE: 5,
  BRONZE: 7,
  SILVER: 10,
  GOLD: Infinity,
};

const watchLimitMiddleware = (req, res, next) => {
  try {
    const user = req.userDoc;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const plan = user.subscription?.plan || "FREE";
    const limit = planLimits[plan];

    if (limit === Infinity) {
      return next();
    }

    const requestedMinutes = Number(req.body.minutes);

    if (requestedMinutes > limit) {
      return res
        .status(403)
        .json({ message: `Your ${plan} plan allows only ${limit} minutes.` });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Watch validation failed" });
  }
};

export default watchLimitMiddleware;
