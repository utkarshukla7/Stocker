import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js'
import homeRoute from './routes/homeRoute.js'
import infoRoute from './routes/infoRoute.js'
import symbolRoute from './routes/symbolRoute.js'
import userRoute from './routes/userRoute.js'
import cors from 'cors';



//dotenv config
dotenv.config();

//mongoDB config
connectDB();

//express app
const app = express();

//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())

//routes
app.use("/", homeRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1", infoRoute);
app.use("/api/v1/symbol", symbolRoute);
app.use("/api/v1/user", userRoute);

//port
const port = process.env.PORT || 8000;


app.listen(port, () => {
    console.log("RUNNING");
});