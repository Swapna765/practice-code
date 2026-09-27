import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./routes/userRoutes.js";
import cors from "cors";
import dns from "dns";
import { Toaster } from "react-hot-toast";

dns.setServers(["8.8.8.8"]);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

app.use("/api", route);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully.");

    app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });