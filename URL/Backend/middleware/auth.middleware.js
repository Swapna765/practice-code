import { findUserById } from "../dao/user.dao.js"
import { verifyToken } from "../utils/helper.js"
import { UnauthorizedError } from "../utils/errorHandler.js"

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken
    if (!token) return next(new UnauthorizedError())

    let userId
    try {
        userId = verifyToken(token)
    } catch {
        return next(new UnauthorizedError())
    }

    const user = await findUserById(userId)
    if (!user) return next(new UnauthorizedError())
    req.user = user
    next()
}