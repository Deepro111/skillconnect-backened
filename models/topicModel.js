import mongoose from "mongoose";

const roadmapStepSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    resourceLink: String,
});

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    roadmap: [roadmapStepSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const topicModel = mongoose.models.topic || mongoose.model('topic', topicSchema);

export default topicModel;
