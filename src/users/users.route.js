import { Router  } from "express";
import * as userRepository  from "./user.controller.js"
import { validatePermission } from "../middleware.js";

const router = Router()

router.post("/changepassword",userRepository .changePasswordByIDContrller)
router.get("/",validatePermission,userRepository .getUsersContrller)
router.post("/getByID",validatePermission,userRepository .getUserByIDContrller)

export default router;