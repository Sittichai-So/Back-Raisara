import ChatService from "./chat.service.js";
import { uploadFile } from "../utils/fileUpload.js";

const chatService = new ChatService();

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { offset = 0, limit = 50 } = req.query;

    const messages = await chatService.getMessages(roomId, parseInt(offset), parseInt(limit));

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "ดึงข้อความสำเร็จ",
      result: messages
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, type, replyTo } = req.body;
    const user = req.user; // From auth middleware

    // Handle file upload if present
    let fileData = {};
    if (req.file) {
      const uploadResult = await uploadFile(req.file);
      fileData = {
        fileUrl: uploadResult.url,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileMimeType: req.file.mimetype
      };
    }

    const messageData = {
      roomId,
      userId: user._id,
      username: user.fullname,
      avatar: user.avatar,
      content,
      type: type || 'text',
      replyTo,
      ...fileData,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        platform: req.get('X-Platform') || 'web'
      }
    };

    const message = await chatService.sendMessage(messageData);

    return res.status(201).json({
      status: "success",
      code: 1,
      message: "ส่งข้อความสำเร็จ",
      result: message
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const user = req.user;

    const message = await chatService.updateMessage(messageId, user._id, content);

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "แก้ไขข้อความสำเร็จ",
      result: message
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const user = req.user;

    await chatService.deleteMessage(messageId, user._id);

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "ลบข้อความสำเร็จ",
      result: null
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};

export const toggleReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const user = req.user;

    const message = await chatService.toggleReaction(messageId, user._id, user.fullname, emoji);

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "อัพเดทรีแอคชันสำเร็จ",
      result: message
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user = req.user;

    const result = await chatService.markMessagesAsRead(roomId, user._id);

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "อ่านข้อความแล้ว",
      result
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};

export const searchMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        status: "fail",
        code: 0,
        message: "คำค้นหาต้องมีอย่างน้อย 2 ตัวอักษร",
        result: null
      });
    }

    const messages = await chatService.searchMessages(roomId, q.trim());

    return res.status(200).json({
      status: "success",
      code: 1,
      message: "ค้นหาข้อความสำเร็จ",
      result: messages
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      code: 0,
      message: error.message,
      result: null
    });
  }
};
