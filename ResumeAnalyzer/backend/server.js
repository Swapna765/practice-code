import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import connectDB from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

if (process.env.DNS_SERVERS) {
  const dnsServers = process.env.DNS_SERVERS
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  dns.setServers(dnsServers);
}

const app = express();

const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// Routes
// -------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Resume Analyzer API is running",
  });
});

app.use("/api/resumes", resumeRoutes);

// -------------------------
// Error Handler
// -------------------------

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  if (err.name === "MulterError" || err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Resume file must be 5 MB or smaller"
          : err.message,
    });
  }

  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// -------------------------
// Start Server
// -------------------------

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("❌ Server error:", error.message);
    });

    server.on("close", () => {
      console.log("⚠️ Server closed");
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

// Keep the process alive
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
});