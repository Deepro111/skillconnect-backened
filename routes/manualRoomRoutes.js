import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  createManualRoom,
  joinManualRoom,
  getManualRooms,
  sendMessageToRoom,
  getMessagesFromRoom,
  getNotesFromRoom,
  getSingleManualRoom,
  deleteNoteFromRoom
} from "../controllers/manualRoomController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { uploadNoteToRoom } from "../controllers/uploadNotes.js";

const manualRoomRouter = express.Router();

// Create / Join / Get Rooms
manualRoomRouter.post("/create", userAuth, createManualRoom);
manualRoomRouter.post("/join", userAuth, joinManualRoom);
manualRoomRouter.get("/", userAuth, getManualRooms);
manualRoomRouter.get('/:roomId', userAuth, getSingleManualRoom);

// Chat Feature
manualRoomRouter.post("/:roomId/send-message", userAuth, sendMessageToRoom);
manualRoomRouter.get("/messages/:roomId", userAuth, getMessagesFromRoom);

// Notes Upload
manualRoomRouter.post("/:roomId/upload-note", userAuth, upload.single("note"), uploadNoteToRoom);
manualRoomRouter.get("/notes/:roomId", userAuth, getNotesFromRoom);
manualRoomRouter.post("/:roomId/delete-note", userAuth, deleteNoteFromRoom);



export default manualRoomRouter;
