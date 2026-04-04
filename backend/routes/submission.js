import express from "express";
import {
  submitCode,
  getLeaderboard,
} from "../controllers/submission.js";

const router = express.Router();

// already protected globally
router.post("/submit", submitCode);
router.get("/leaderboard/:roomId", getLeaderboard);

export default router;