import { Router  } from "express";
import * as RoomController from "./room.controller.js";

const router = Router();

router.get("/getRoom", RoomController.getRoom);
router.post("/joinRoom", RoomController.joinRoomId);

export default router;
