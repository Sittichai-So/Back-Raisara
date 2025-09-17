import { Router } from "express"
import * as userController from "./users.controller.js"

const router = Router()

router.get("/", userController.getUsersContrller)
router.patch("/:id/status", userController.updateStatusController)

export default router