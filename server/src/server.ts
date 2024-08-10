import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {Rooms} from "./interface/Rooms";
import { joinRoom } from "./utils/JoinRoom";



const app = express();
const roomsToSocketMapping : Map<string, Rooms> = new Map();
const socketToRoomMapping : Map<string, string> = new Map();
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
        joinRoom(socket, roomsToSocketMapping, choice, message.customRoomId ? message.customRoomId : undefined, name, socketToRoomMapping);
    })
// Remove this event later on
socket.on("show-rooms", () => {
    console.log(roomsToSocketMapping)
});

});

httpServer.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
});