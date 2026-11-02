export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err)

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "That value is already in use." })
  }

  if (err.name === "ValidationError" || err.name === "CastError" || err.status === 400) {
    return res.status(400).json({ success: false, message: err.message || "Invalid request." })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  console.error(err)
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  })
}

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found.") {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict occurred.") {
    super(message, 409)
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request.") {
    super(message, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized.") {
    super(message, 401)
  }
}
