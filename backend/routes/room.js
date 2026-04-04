import express from "express";
import {
  createRoom,
  joinRoom,
  startRoom,
  getRoom,
  setProblem,
} from "../controllers/room.js";

const router = express.Router();

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.post("/start", startRoom);
router.post("/set-problem", setProblem);
router.get("/:roomId", getRoom);
export default router;