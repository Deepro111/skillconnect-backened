import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js"
import topicRouter from "./routes/topicRoutes.js"
import threadRouter from "./routes/threadRoutes.js"
import manualRoomRouter from "./routes/manualRoomRoutes.js"

const app = express();
const PORT = process.env.PORT || 8000;
connectDB();

const allowedOrigins = ['http://localhost:5173', 'https://skillconnect-frontend-ten.vercel.app']; 

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: allowedOrigins, credentials: true}))

// API endpoints
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/topics', topicRouter)
app.use('/api/threads', threadRouter)
app.use('/api/manual-rooms', manualRoomRouter)

app.listen(PORT, ()=>console.log(`Server Started on PORT:${PORT}`));
