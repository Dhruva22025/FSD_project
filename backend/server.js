import dotenv from 'dotenv';
dotenv.config(); // <-- Must come before any imports that use process.env

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from "./routes/auth.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV !== "production";

// Middleware
app.use(
  cors({
    origin: isDev ? "http://localhost:5173" : `${process.env.CLIENT_URL}`,
    // hardcoded here 
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Routes
// app.use('/api', (req, res) => res.json({ message: 'Web3 OTT API is running' }));
app.use("/api/auth", authRoutes);

// file serving for production
if (!isDev) {
  app.use(express.static(path.join(__dirname, "../client", "/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "/dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT} in ${isDev ? "development" : "production"} mode`);
});