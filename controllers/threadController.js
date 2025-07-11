import threadModel from "../models/threadModel.js";

export const createThread = async (req, res) => {
    try {
        const { topicId, title, description } = req.body;
        const userId = req.userId;

        const thread = new threadModel({ topicId, title, description, userId });
        await thread.save();

        res.status(201).json({ success: true, thread });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getThreadsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        const threads = await threadModel.find({ topicId })
            .populate("userId", "name")                        // Who asked the doubt
            .populate("replies.userId", "name")               // Who replied
            .sort({ createdAt: -1 });


        res.status(200).json({ success: true, threads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addReply = async (req, res) => {
    try {
        const { threadId, message } = req.body;
        const userId = req.userId;

        const thread = await threadModel.findById(threadId);
        if (!thread) return res.status(404).json({ success: false, message: "Thread not found" });

        thread.replies.push({ userId, message });
        await thread.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

