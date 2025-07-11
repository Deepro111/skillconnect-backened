import express from 'express'
import { getAllTopics, createTopic } from '../controllers/topicController.js';

const topicRouter = express.Router();
topicRouter.get("/", getAllTopics);

topicRouter.post("/", createTopic); 

export default topicRouter
