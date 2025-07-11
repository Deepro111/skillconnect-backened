import s3 from "../config/s3.js";
import manualRoomModel from "../models/manualRoomModel.js";
import userModel from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

export const uploadNoteToRoom = async (req, res) => {
  const { roomId } = req.params;
  const { title } = req.body;
  const userId = req.userId;
  const file = req.file;

  if (!file) return res.json({ success: false, message: "No file uploaded" });

  const filename = `${uuidv4()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: "public-read",
  };

  try {
    const s3Data = await s3.upload(params).promise();
    const url = s3Data.Location;

    const user = await userModel.findById(userId);
    const room = await manualRoomModel.findOne({ roomId });

    room.notes.push({
      user: user._id,
      title,
      url,
    });

    await room.save();

    return res.json({ success: true, message: "Note uploaded", url });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload to S3" });
  }
};
