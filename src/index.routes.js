import { Router } from "express"
import authRoute from "./auth/auth.route.js"
import categoriesRoute from "./categories/categories.route.js"
import roomRoute from "./room/room.route.js"
import ChatRoute from "./chat/chat.route.js"
const router = Router()
 
router.use("/auth",authRoute)

router.use("/categories",categoriesRoute)
router.use("/room",roomRoute)
router.use("/chat",ChatRoute)


export default router