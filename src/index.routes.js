import { Router } from "express"
import authRoute from "./auth/auth.route.js"
import categoriesRoute from "./categories/categories.route.js"
import roomRoute from "./room/room.route.js"
const router = Router()
 
router.use("/auth",authRoute)

router.use("/categories",categoriesRoute)
router.use("/room",roomRoute)


export default router