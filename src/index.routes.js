import { Router } from "express"
import authRoute from "./auth/auth.route.js"
import categoriesRoute from "./categories/categories.route.js"
import roomRoute from "./room/room.route.js"
import ChatRoute from "./chat/chat.route.js"
import ChatLogRoute from "./chatLog/chatLog.route.js"
import UsersRoute from "./users/users.route.js"
const router = Router()
 
router.use("/auth",authRoute)
router.use("/user",UsersRoute)
router.use("/categories",categoriesRoute)
router.use("/room",roomRoute)
router.use("/chat",ChatRoute)
router.use("/chatLog",ChatLogRoute)


export default router