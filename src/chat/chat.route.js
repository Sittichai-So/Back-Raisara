import { Router } from "express";
import * as ChatController from "./chat.controller.js";

const router = Router();

router.get("/:roomId/messages", ChatController.getMessages);

router.post("/:roomId/messages", ChatController.sendMessage);

router.put("/messages/:messageId", ChatController.updateMessage);

router.delete("/messages/:messageId", ChatController.deleteMessage);

router.get("/:roomId/search", ChatController.searchMessages);

router.get("/room/:roomId", ChatController.getRoomById);

export default router;
