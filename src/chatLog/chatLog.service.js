// chatLog.service.js
import cron from "node-cron";
import ChatLog from "../model/chatLog.model.js";

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🧹 ลบข้อความเก่ากว่า 3 วัน...");

    await ChatLog.updateMany(
      {},
      { $pull: { chatAll: { timestamp: { $lt: new Date(Date.now() - 3*24*60*60*1000) } } } }
    );

    console.log("✅ ลบข้อความเก่าสำเร็จ");
  } catch (err) {
    console.error("❌ ลบข้อความไม่สำเร็จ:", err);
  }
});

class ChatLogService {
  async addMessage(roomId, messageData) {
    return await ChatLog.findOneAndUpdate(
      { roomId },
      { $push: { chatAll: messageData } },
      { upsert: true, new: true }
    ).populate("chatAll.userId", "firstName lastName username displayName avatar");
  }

  async getMessages(roomId) {
    const log = await ChatLog.findOne({ roomId })
      .populate("chatAll.userId", "firstName lastName username displayName avatar");

    if (!log) return [];

    return log.chatAll
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(msg => ({
        _id: msg._id || new Date().getTime().toString(),
        content: msg.text || '',
        username: msg.username || msg.userId?.username || msg.userId?.displayName || 'Unknown',
        fullName: `${msg.userId?.firstName || msg.userId?.username || msg.userId?.displayName || 'Unknown'} ${msg.userId?.lastName || ''}`.trim(),
        avatar: msg.userId?.avatar || null,
        userId: msg.userId?._id ? String(msg.userId._id) : 'guest',
        createdAt: msg.timestamp,
        type: msg.type || 'text',
        replyTo: msg.replyTo || null
      }));
  }

  async clearMessages(roomId) {
    return await ChatLog.findOneAndUpdate(
      { roomId },
      { $set: { chatAll: [] } },
      { new: true }
    );
  }

  async getCountMessages(roomId) {
    const log = await ChatLog.findOne({ roomId }, { chatAll: 1 });
    return log ? log.chatAll.length : 0;
  }

  async getCountMessagesAllRooms() {
    const logs = await ChatLog.find({}, { roomId: 1, chatAll: 1 });
    return logs.map(l => ({
      roomId: l.roomId,
      count: l.chatAll.length
    }));
  }
}

export default new ChatLogService();