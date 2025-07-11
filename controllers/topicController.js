import Topic from "../models/topicModel.js";

export const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json({ success: true, topics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Add new topic (optional, admin only)
export const createTopic = async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json({ success: true, topic });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
