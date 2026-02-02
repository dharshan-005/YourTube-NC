import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
  const { name, description } = req.body;

  try {
    const existing = await Channel.findOne({ owner: req.user.id });

    if (existing) {
      return res.status(200).json(existing);
    }

    const channel = await Channel.create({
      owner: req.user.id,
      name,
      description,
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).jspn({ message: "Channel creation failed." });
  }
};

export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user.id });
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch channel." });
  }
};
