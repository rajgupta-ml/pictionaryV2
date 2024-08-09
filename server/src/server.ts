import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {Rooms} from "./interface/Rooms";
import { joinRoom } from "./utils/JoinRoom";



const app = express();
const rooms : Map<string, Rooms> = new Map();
const socketIdToNameMapping : Map<string, string> = new Map(); 
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors : {
        origin : "*",
    }
});
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log("Socket is connected")
    // Check if room length is less than 8
    socket.on("join-room", (message) => {
        const {choice, name} = message;
        let roomId;
        roomId = joinRoom(socket, rooms, choice, message.customRoomId ? message.customRoomId : undefined, name);
        socket.emit("set-room-id", {roomId});
    })

socket.on("show-rooms", () => {
    console.log(rooms)
});

});

httpServer.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
});