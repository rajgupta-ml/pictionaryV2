"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueRoomIdGenrator = uniqueRoomIdGenrator;
const uuid_1 = require("uuid");
function uniqueRoomIdGenrator() {
    const roomdId = (0, uuid_1.v4)();
    return roomdId;
}
