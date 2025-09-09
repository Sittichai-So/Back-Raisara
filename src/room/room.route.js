import { Router  } from "express";
import * as Room from "./room.controller.js";

const router = Router();

router.get("/getRoom", Room.getRoom);

export default router;
