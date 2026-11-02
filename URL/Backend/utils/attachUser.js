import { findUserById } from "../dao/user.dao.js"
import { verifyToken } from "./helper.js"

export const attachUser = async (req, res, next) => {
    const token = req.cookies.accessToken
    if(!token) return next()

    let userId
    try {
        userId = verifyToken(token)
    } catch {
        next()
        return
    }

    req.user = await findUserById(userId) || undefined
    next()
}