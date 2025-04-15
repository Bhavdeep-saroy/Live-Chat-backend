import mongoose from 'mongoose';
import connectDB from './db/index.js';
import dotenv from 'dotenv';
import { app,io } from './app.js';


 

dotenv.config({
    path: './.env'
});


connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;

        io.on('connect', (socket) => {
            console.log('A user connected');
            socket.on('joined', ({ Sender_Id }) => {
                console.log(`${Sender_Id} has joined`);

                socket.emit('welcome', { user: "Admin", message: `Welcome to the chat ${Sender_Id}` });
                socket.broadcast.emit('userJoined', { user: "Admin", message: `${Sender_Id} has joined` });
            });
            socket.on('selectUserChat',({data}) => {
                io.emit('changeUser',({user:"data"}));
            })
            io.emit('login',({user:"login"}));
            socket.on('disconnect', () => {
                console.log('A user disconnected');
                io.emit('logout', ({ user: "logout" }));
            });

        });

        const server = app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        });

        io.attach(server);
      
    }) .catch((err) => {
        console.log("MONGO DB CONNECTION FAILED !!! ", err);
    });
    
