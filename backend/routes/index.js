import express from "express";
import authRoutes from "./auth.js";
import roomRoutes from "./room.js";
import submissionRoutes from "./submission.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

/**
 *  PUBLIC ROUTES (NO AUTH)
 */
router.use("/auth", authRoutes);

/**
 * 🔐 APPLY USER PROTECTION TO EVERYTHING BELOW
 */
router.use(protectRoute);

router.use("/rooms", roomRoutes);
router.use("/submission", submissionRoutes);
export default router;