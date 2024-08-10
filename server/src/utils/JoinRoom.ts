import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Rooms } from "../interface/Rooms";


// Join the room and send emit message to all the clients of the room
function joinOrCreateRoom(
    roomId: string, 
    socket: Socket, 
    roomsToSocketMapping: Map<string, Rooms>, 
    emitJoinMessage: boolean, 
    roomType : "Private" | "Global", 
    name : string, ): string 
    {
    let room = roomsToSocketMapping.get(roomId);
    const subscriber = new Map<string, string>();
    subscriber.set(socket.id, name);
    if (room && room.subscribers.size < 2) room.subscribers.add(subscriber);
    else{
        room = { subscribers: new Set(), roomType };
        room.subscribers.add(subscriber);
        roomsToSocketMapping.set(roomId, room);
    }

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}.`);

    if (emitJoinMessage) {
        socket.to(roomId).emit('userJoined', `${name} has joined the room`);

    }
    return roomId;
}

export function joinRoom(
    socket: Socket,
    roomsToSocketMapping: Map<string, Rooms>,
    choice: 'Private' | 'Global',
    customRoomId: string,
    name : string,
    socketToRoomMapping : Map<string, string>
): void {

    let roomId;
    if (choice === 'Private') {
        if (!customRoomId) {
            throw new Error ("Custom room id is required for privates rooms");
        }
        roomId = joinOrCreateRoom(customRoomId, socket, roomsToSocketMapping, true, "Private", name);
    } else {
        const availableRoom = Array.from(roomsToSocketMapping.entries()).find(([, room]) => room.subscribers.size < 2 && room.roomType == "Global");
        
        if (availableRoom) {
            roomId = joinOrCreateRoom(availableRoom[0], socket, roomsToSocketMapping, true, "Global", name);
        } else {
            roomId = joinOrCreateRoom(uuidv4(), socket, roomsToSocketMapping, false, "Global", name);
        }
    }

    // Mapping the socket to The roomId 
    socketToRoomMapping.set(socket.id, roomId);
}