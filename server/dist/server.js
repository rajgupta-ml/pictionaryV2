"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const JoinRoom_1 = require("./utils/JoinRoom");
const app = (0, express_1.default)();
const rooms = new Map();
const socketIdToNameMapping = new Map();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    }
});
const PORT = process.env.PORT || 3000;
io.on("connection", (socket) => {
    console.log("Socket is connected");
    // Check if room length is less than 8
    socket.on("join-room", (message) => {
        const { choice, name } = message;
        (0, JoinRoom_1.joinRoom)(socket, rooms, choice, message.customRoomId ? message.customRoomId : undefined, name);
    });
    socket.on("show-rooms", () => {
        for (const [key, room] of rooms) {
            console.log(`Room ID: ${key}`);
            for (const subscriberMap of room.subscribers) {
                // subscriberMap is a Map<string, string>
                for (const [socketId, name] of subscriberMap) {
                    console.log(`Socket ID: ${socketId}, Name: ${name}`);
                }
            }
        }
    });
    // Join the room and send emit message to all the clients of the room
    // return the room id as cookies
});
httpServer.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
