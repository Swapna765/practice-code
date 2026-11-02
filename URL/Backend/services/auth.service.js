import { createUser, findUserByEmail, findUserByEmailByPassword } from "../dao/user.dao.js"
import { BadRequestError, ConflictError, UnauthorizedError } from "../utils/errorHandler.js"
import { signToken } from "../utils/helper.js"

export const registerUser = async (name, email, password) => {
    if (typeof name !== "string" || name.trim().length < 2) {
        throw new BadRequestError("Name must be at least 2 characters.")
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new BadRequestError("Enter a valid email address.")
    }
    if (typeof password !== "string" || password.length < 8) {
        throw new BadRequestError("Password must be at least 8 characters.")
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (await findUserByEmail(normalizedEmail)) {
        throw new ConflictError("An account with that email already exists.")
    }

    let user
    try {
        user = await createUser(name.trim(), normalizedEmail, password)
    } catch (error) {
        if (error.code === 11000) {
            throw new ConflictError("An account with that email already exists.")
        }
        throw error
    }

    const token = signToken({ id: user._id })
    return { token, user }
}

export const loginUser = async (email, password) => {
    if (typeof email !== "string" || typeof password !== "string" || !password) {
        throw new BadRequestError("Email and password are required.")
    }
    const user = await findUserByEmailByPassword(email.trim().toLowerCase())
    if (!user) throw new UnauthorizedError("Invalid email or password.")

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) throw new UnauthorizedError("Invalid email or password.")
    const token = signToken({ id: user._id })
    return { token, user }
}
