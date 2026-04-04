import express from "express";
import { changeEmail, changePassword, login, logout, signupManual, signupGoogle, googleLogin } from "../controllers/auth.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signupManual);

router.post("/google-signup", signupGoogle);

router.post("/google-login", googleLogin);

router.post("/login", login);

router.post("/logout", logout);

router.put("/change-password", protectRoute, changePassword);

router.put("/change-email", protectRoute, changeEmail);

export default router;