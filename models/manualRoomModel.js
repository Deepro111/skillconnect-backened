import mongoose from "mongoose";

const manualRoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  // Chat messages embedded in the room
  messages: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  // Notes uploaded by users in the room
  notes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      title: { type: String, required: true },
      url: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite on hot-reload
const manualRoomModel =
  mongoose.models.manualRoom || mongoose.model("manualRoom", manualRoomSchema);

export default manualRoomModel;
