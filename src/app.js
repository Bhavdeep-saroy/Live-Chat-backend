import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import http from 'http';
import { Server } from 'socket.io';



const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        credentials: true,
    },
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || '34534543634ewrew',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set to true only in production with HTTPS
    })
);
app.use(cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));


app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';
import socketRouter from './routes/socket.routes.js';
import chatRouter from './routes/chat.routes.js';


app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/io", socketRouter);
app.use("/api/v1/users", userRouter);






export { app, io  };
