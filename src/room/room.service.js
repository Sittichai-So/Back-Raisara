// room.service.js
import Room from "../model/room.model.js";

export default class RoomService {
  async getAll() {
    try {
      const rooms = await Room.find().sort({ createdAt: -1 });
      
      const roomsWithCount = rooms.map(room => {
        const roomObj = room.toObject();
        return {
          ...roomObj,
          memberCount: roomObj.members ? roomObj.members.length : 0
        };
      });
      
      return roomsWithCount;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to get room", {
        cause: "get_room_error",
      });
    }
  }

  async joinRoom(roomId, user) {
    try {
      const room = await Room.findById(roomId);
      if (!room) throw new Error("ไม่พบห้อง");

      const alreadyMember = room.members.find(m => m.userId === user.userId);
      if (alreadyMember) {
        return {
          ...room.toObject(),
          memberCount: room.members.length,
          message: "คุณเป็นสมาชิกห้องนี้อยู่แล้ว"
        };
      }

      room.members.push(user);
      const savedRoom = await room.save();
      
      return {
        ...savedRoom.toObject(),
        memberCount: savedRoom.members.length
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to join room");
    }
  }
}