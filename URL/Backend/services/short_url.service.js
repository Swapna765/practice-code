import { generateNanoId } from "../utils/helper.js"
import { saveShortUrl } from "../dao/short_url.js"
import { BadRequestError, UnauthorizedError } from "../utils/errorHandler.js"

export const createShortUrl = async (url, slug, userId) => {
  if (typeof url !== "string" || !url.trim()) {
    throw new BadRequestError("A URL is required.")
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url.trim())
  } catch {
    throw new BadRequestError("Enter a valid URL.")
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new BadRequestError("Only HTTP and HTTPS links are supported.")
  }

  if (slug !== undefined && slug !== null && slug !== "") {
    if (typeof slug !== "string" || !/^[A-Za-z0-9-]{3,30}$/.test(slug)) {
      throw new BadRequestError("Custom endings must be 3–30 letters, numbers, or hyphens.")
    }
    if (!userId) throw new UnauthorizedError("Sign in to choose a custom ending.")
  }

  const shortCode = slug || generateNanoId(7)
  await saveShortUrl(shortCode, parsedUrl.toString(), userId)
  return shortCode
}
