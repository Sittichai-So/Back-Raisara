import Room from "../model/room.model.js";
import User from "../model/user.model.js";
import chatLogService from "../chatLog/chatLog.service.js";

const rooms = {};

const getMemberPayload = (m) => {
  const user = m.userId;
  return {
    _id: user._id,
    fullname: user.fullname || user.displayName || user.username || 'Unknown User',
    avatar: user.avatar || null,
    status: user.status || 'offline',
    lastSeen: user.lastSeen || null,
    joinedAt: m.joinedAt || null
  };
};

export default function chatHandler(io, socket) {
  // Join room
  socket.on("joinRoom", async ({ roomId, user }) => {
    try {
      socket.userId = user._id;
      socket.join(roomId);

      await User.findByIdAndUpdate(user._id, { status: 'online' });

      let room = await Room.findById(roomId);
      if (!room) return;

      const exists = room.members.some(m => String(m.userId) === String(user._id));
      if (!exists) {
        room.members.push({ userId: user._id, joinedAt: new Date() });
        await room.save();
      }

      if (!rooms[roomId]) rooms[roomId] = [];
      if (!rooms[roomId].some(u => u._id === user._id)) {
        rooms[roomId].push(user);
      }

      const populatedRoom = await Room.findById(roomId)
        .populate("members.userId", "fullname displayName username avatar status lastSeen");

      io.to(roomId).emit("roomMembers", populatedRoom.members.map(getMemberPayload));

    } catch (err) {
      console.error("joinRoom error:", err);
    }
  });

  // Status changed
  socket.on("statusChanged", async ({ roomId, userId, status }) => {
    try {
      await User.findByIdAndUpdate(userId, {
        status: status || 'offline',
        lastSeen: new Date()
      });

      if (roomId && rooms[roomId]) {
        const member = rooms[roomId].find(m => m._id === userId)
        if (member) member.status = status || 'offline';
        io.to(roomId).emit("roomMembers", rooms[roomId]);
      }
    } catch (err) {
      console.error("statusChanged error:", err);
    }
  });

  // Disconnect
  socket.on("disconnect", async () => {
    try {
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter(u => u._id !== socket.userId);
        await User.findByIdAndUpdate(socket.userId, {
          status: "offline",
          lastSeen: new Date()
        });
        io.to(roomId).emit("roomMembers", rooms[roomId]);
      }
    } catch (err) {
      console.error("disconnect error:", err);
    }
  });

socket.on("sendMessage", async ({ roomId, message, user, replyTo }) => {
  try {
    const msgData = {
      text: message,
      userId: user._id,
      username: user.username || user.fullname || user.displayName || 'Unknown',
      timestamp: new Date(),
      type: 'text',
      replyTo: replyTo?._id || null
    };

    await chatLogService.addMessage(roomId, msgData);
      io.to(roomId).emit("receiveMessage", {
        _id: msgData._id || new Date().getTime().toString(),
        content: msgData.text,
        username: msgData.username,
        fullName: `${user.firstName || user.username || user.displayName} ${user.lastName || ''}`.trim(),
        avatar: user.avatar || null,
        userId: String(user._id),
        createdAt: msgData.timestamp,
        type: msgData.type,
        replyTo: msgData.replyTo
      });
  } catch (err) {
    console.error("sendMessage error:", err);
  }
});


}
