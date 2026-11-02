import express from "express"
import { getUserUrlHistory } from "../controller/user.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/history", authMiddleware, getUserUrlHistory)

export default router
