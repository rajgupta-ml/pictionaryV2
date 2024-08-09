"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinRoom = joinRoom;
const uuid_1 = require("uuid");
function joinOrCreateRoom(roomId, socket, rooms, emitJoinMessage, roomType, name) {
    let room = rooms.get(roomId);
    const subscriber = new Map();
    subscriber.set(socket.id, name);
    if (room && room.subscribers.size < 2)
        room.subscribers.add(subscriber);
    else {
        room = { subscribers: new Set(), roomType };
        room.subscribers.add(subscriber);
        rooms.set(roomId, room);
    }
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}.`);
    if (emitJoinMessage) {
        socket.to(roomId).emit('userJoined', roomId);
    }
    // socket.to(socket.id).emit("getRoomId", roomId);
}
function joinRoom(socket, rooms, choice, customRoomId, name) {
    if (choice === 'Private') {
        if (!customRoomId) {
            throw new Error("Custom room id is required for privates rooms");
        }
        joinOrCreateRoom(customRoomId, socket, rooms, true, "Private", name);
    }
    else {
        const availableRoom = Array.from(rooms.entries()).find(([, room]) => room.subscribers.size < 2 && room.roomType == "Global");
        if (availableRoom) {
            joinOrCreateRoom(availableRoom[0], socket, rooms, true, "Global", name);
        }
        else {
            joinOrCreateRoom((0, uuid_1.v4)(), socket, rooms, false, "Global", name);
        }
    }
}
