import { getShortUrl } from "../dao/short_url.js"
import { createShortUrl } from "../services/short_url.service.js"
import wrapAsync from "../utils/tryCatchWrapper.js"
import { NotFoundError } from "../utils/errorHandler.js"
import { buildShortUrl } from "../utils/helper.js"

export const createShortUrlController = wrapAsync(async (req, res) => {
  const { url, slug } = req.body
  const shortCode = await createShortUrl(url, slug, req.user?._id)

  res.status(201).json({ shortUrl: buildShortUrl(shortCode) })
})

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const shortLink = await getShortUrl(req.params.id)
  if (!shortLink) throw new NotFoundError("Short link not found")

  res.redirect(shortLink.full_url)
})
