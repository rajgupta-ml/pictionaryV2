import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Rooms } from "../interface/Rooms";


// Join the room and send emit message to all the clients of the room
function joinOrCreateRoom(roomId: string, socket: Socket, rooms: Map<string, Rooms>, emitJoinMessage: boolean, roomType : "Private" | "Global", name : string): string {
    let room = rooms.get(roomId);
    const subscriber = new Map<string, string>();
    subscriber.set(socket.id, name);
    if (room && room.subscribers.size < 2) room.subscribers.add(subscriber);
    else{
        room = { subscribers: new Set(), roomType };
        room.subscribers.add(subscriber);
        rooms.set(roomId, room);
    }

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}.`);

    if (emitJoinMessage) {
        socket.to(roomId).emit('userJoined', `${name} has joined the room`);

    }
    // return the room id as cookies
    return roomId
}

export function joinRoom(
    socket: Socket,
    rooms: Map<string, Rooms>,
    choice: 'Private' | 'Global',
    customRoomId: string,
    name : string,
): string {
    let roomId;
    if (choice === 'Private') {
        if (!customRoomId) {
            throw new Error ("Custom room id is required for privates rooms");
        }
        roomId = joinOrCreateRoom(customRoomId, socket, rooms, true, "Private", name);
    } else {
        const availableRoom = Array.from(rooms.entries()).find(([, room]) => room.subscribers.size < 2 && room.roomType == "Global");
        
        if (availableRoom) {
            roomId = joinOrCreateRoom(availableRoom[0], socket, rooms, true, "Global", name);
        } else {
            roomId = joinOrCreateRoom(uuidv4(), socket, rooms, false, "Global", name);
        }
    }
    return roomId
}