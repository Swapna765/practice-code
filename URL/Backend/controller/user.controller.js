import { getUserShortUrls } from "../dao/short_url.js"
import { buildShortUrl } from "../utils/helper.js"
import wrapAsync from "../utils/tryCatchWrapper.js"

export const getUserUrlHistory = wrapAsync(async (req, res) => {
  const urls = await getUserShortUrls(req.user._id)

  res.status(200).json({
    urls: urls.map((url) => ({
      _id: url._id,
      full_url: url.full_url,
      short_url: url.short_url,
      shortUrl: buildShortUrl(url.short_url),
    })),
  })
})
