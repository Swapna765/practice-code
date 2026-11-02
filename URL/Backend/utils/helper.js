import { nanoid } from "nanoid";
import jsonwebtoken from "jsonwebtoken"

export const generateNanoId = (length) => {
    return nanoid(length);
}

export const signToken = (payload) => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required.")
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"})
}

export const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required.")
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    if (typeof decoded === "string" || typeof decoded.id !== "string") {
        throw new Error("Invalid authentication token.")
    }
    return decoded.id
}

export const buildShortUrl = (shortCode) => {
    const baseUrl = process.env.APP_URL
    if (!baseUrl) throw new Error("APP_URL is required.")
    return new URL(shortCode, `${baseUrl.replace(/\/+$/, "")}/`).toString()
}