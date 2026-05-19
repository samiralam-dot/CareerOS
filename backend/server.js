import express from "express";
import cors from "cors";
import db from "./config/db.js";
import userroutes from "./routes/userroutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import appRoutes from './routes/AppRoutes.js'
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import uploadRoutes from './routes/uploadRoutes.js';
import mailRoutes from './routes/otpRoutes.js'
import notificationroutes from './routes/notificationroutes.js'

dotenv.config();

const app = express();
const PORT = 5000;



app.use(cors({
    origin: "https://career-os-p5ge.vercel.app/",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())



// routes
app.use("/api/user",userroutes);
app.use("/api/job", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/application",appRoutes)
app.use("/api", mailRoutes);
app.use("/api/notification", notificationroutes);

app.use("/api/interview", interviewRoutes);



app.use('/api', uploadRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db();
