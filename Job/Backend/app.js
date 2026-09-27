const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const authRouter = require("./src/routes/auth.routes");
const interviewRouter = require("./src/routes/interview.routes.js");


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter)

app.get("/", (req, res) => {
    res.json({
        message: "Minor Project Backend API is running"
    });
});

app.use((error, req, res, next) => {
    console.error(error)

    const statusCode = Number(error.statusCode || error.status)
    const isValidErrorStatus = Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 600

    res.status(isValidErrorStatus ? statusCode : 500).json({
        message: statusCode === 503
            ? "The AI service is temporarily busy. Please try again shortly."
            : statusCode === 502
                ? error.message
            : "An unexpected server error occurred."
    })
})

module.exports = app;