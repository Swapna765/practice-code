import urlSchema from "../models/short_url.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    const newUrl = new urlSchema({
        full_url: longUrl,
        short_url: shortUrl,
        ...(userId ? { user: userId } : {}),
    })

    try {
        await newUrl.save()
    } catch (error) {
        if (error.code === 11000) {
            throw new ConflictError("That short link is already in use.")
        }
        throw error
    }
};

export const getShortUrl = async (shortUrl) => {
    return urlSchema.findOne({ short_url: shortUrl })
}

export const getUserShortUrls = async (userId) => {
    return urlSchema.find({ user: userId }).sort({ createdAt: -1 })
}