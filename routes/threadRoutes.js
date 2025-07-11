import express from "express";
import { createThread, getThreadsByTopic, addReply } from "../controllers/threadController.js";
import userAuth from "../middlewares/userAuth.js";

const threadRouter = express.Router();

threadRouter.post("/", userAuth, createThread); // POST a new thread
threadRouter.get("/:topicId", getThreadsByTopic); // GET all threads for a topic
threadRouter.post("/reply", userAuth, addReply);

export default threadRouter;
