// routes/chatLog.route.js
import express from "express";
import chatLogController from "./chatLog.controller.js";

const router = express.Router();

router.get("/:roomId/messages", chatLogController.getMessages);
router.post("/:roomId/messages", chatLogController.addMessage);
router.delete("/:roomId/messages", chatLogController.clearMessages);

router.get("/:roomId/count", chatLogController.getCountMessages);
router.get("/counts/all", chatLogController.getCountMessagesAllRooms);

export default router;
