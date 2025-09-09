import Room from "../model/room.model.js";

export default class RoomService {
  async getAll() {
    try {
      const room = await Room.find().sort({ createdAt: -1 });
      return room;
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Failed to get room", {
        cause: "get_room_error",
      });
    }
  }
}

