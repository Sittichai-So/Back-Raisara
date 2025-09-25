import chatLogService from "./chatLog.service.js";

class ChatLogController {
  async addMessage(req, res) {
    try {
      const { roomId } = req.params;
      const { text, userId, username } = req.body;

      const newMessage = {
        text,
        userId,
        username,
        timestamp: new Date()
      };

      const result = await chatLogService.addMessage(roomId, newMessage);
      return res.status(201).json(result);
    } catch (err) {
      console.error("addMessage error:", err);
      return res.status(500).json({ message: "Failed to add message" });
    }
  }

  async getMessages(req, res) {
    try {
      const { roomId } = req.params;
      const messages = await chatLogService.getMessages(roomId);
      return res.json(messages);
    } catch (err) {
      console.error("getMessages error:", err);
      return res.status(500).json({ message: "Failed to fetch messages" });
    }
  }

  async clearMessages(req, res) {
    try {
      const { roomId } = req.params;
      const result = await chatLogService.clearMessages(roomId);
      return res.json({ message: "Messages cleared", result });
    } catch (err) {
      console.error("clearMessages error:", err);
      return res.status(500).json({ message: "Failed to clear messages" });
    }
  }

    async getCountMessages(req, res) {
    try {
      const { roomId } = req.params;
      const count = await chatLogService.getCountMessages(roomId);
      return res.json({ roomId, count });
    } catch (err) {
      console.error("getCountMessages error:", err);
      return res.status(500).json({ message: "Failed to get message count" });
    }
  }

  async getCountMessagesAllRooms(req, res) {
    try {
      const counts = await chatLogService.getCountMessagesAllRooms();
      return res.status(200).send({
        status: "success",
        code: 1,
        message: counts.length > 0 ? "ดึงข้อมูลสำเร็จ" : "ไม่มีข้อมูล",
        cause: "",
        result : counts && counts.length > 0 ? counts : []
      })
    } catch (err) {
      console.error("getCountMessagesAllRooms error:", err);
      return res.status(500).json({ message: "Failed to get message counts" });
    }
  }
}

export default new ChatLogController();
