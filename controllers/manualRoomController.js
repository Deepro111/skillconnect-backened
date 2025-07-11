import manualRoomModel from "../models/manualRoomModel.js";
import { nanoid } from "nanoid";
import s3 from "../config/s3.js"

// Create Room
export const createManualRoom = async (req, res) => {
  try {
    const { roomName } = req.body;
    const createdBy = req.userId;

    const roomId = nanoid(8); // 8-char unique ID

    const newRoom = new manualRoomModel({
      roomName,
      roomId,
      createdBy,
      members: [createdBy],
    });

    await newRoom.save();
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Join Room
export const joinManualRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;

    const room = await manualRoomModel.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getManualRooms = async (req, res) => {
  try {
    const userId = req.userId;
    const rooms = await manualRoomModel.find({ members: userId });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessageToRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message } = req.body;
    // console.log("Incoming message:", message);
    // console.log("User ID:", req.userId);

    const room = await manualRoomModel.findOne({ roomId });
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    room.messages = room.messages || [];
    room.messages.push({
      user: req.userId,
      message,
    });

    await room.save();
    return res.status(200).json({ success: true, message: "Message sent" });
  } catch (err) {
    console.error("Send Message Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getMessagesFromRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ManualRoom.findOne({ roomId }).populate("messages.user", "name");
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }

    res.json({ success: true, messages: room.messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getNotesFromRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ManualRoom.findOne({ roomId }).populate("notes.user", "name");
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }

    res.json({ success: true, notes: room.notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// manualRoomController.js
export const getSingleManualRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await manualRoomModel.findOne({ roomId })
      .populate("members", "name")
      .populate("createdBy", "name")
      .populate("messages.user", "name")
      .populate("notes.user", "name");


    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching room" });
  }
};

export const deleteNoteFromRoom = async (req, res) => {
  console.log("🔥 DELETE NOTE route hit");
  const { roomId } = req.params;
  const { noteUrl } = req.body;
  const userId = req.userId;

  // console.log("DELETE NOTE route hit");
  // console.log({ roomId, noteUrl, userId });
  try {
    const room = await manualRoomModel.findOne({ roomId });
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    const note = room.notes.find(n => n.url === noteUrl);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (note.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this note" });
    }

    const key = noteUrl.split("/").pop(); // Get the S3 file key
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    }).promise();

    room.notes = room.notes.filter(n => n.url !== noteUrl);
    await room.save();

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};
