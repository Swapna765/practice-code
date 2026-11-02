import "dotenv/config"
import { pathToFileURL } from "node:url"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongo.config.js"
import shortUrlRoutes from "./routes/short_url.route.js"
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import { redirectFromShortUrl } from "./controller/short_url.controller.js"
import { errorHandler, NotFoundError } from "./utils/errorHandler.js"
import { attachUser } from "./utils/attachUser.js"

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}))
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(attachUser)

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/create", shortUrlRoutes)
app.get("/:id", redirectFromShortUrl)
app.use((req, res, next) => next(new NotFoundError("Route not found.")))
app.use(errorHandler)

export async function startServer() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required.")
  if (!process.env.APP_URL) throw new Error("APP_URL is required.")

  await connectDB()
  const port = Number(process.env.PORT) || 3000
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    console.error(`Unable to start server: ${error.message}`)
    process.exitCode = 1
  })
}

export default app
