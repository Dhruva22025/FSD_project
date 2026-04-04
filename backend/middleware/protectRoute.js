import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectRoute = async (req, res, next) => {
    try {
        // console.log(req.cookies)
        let token = req.cookies?.jwt;
        // console.log("protectRoute token from cookie:", token);

        if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ msg: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token expired" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid token" });
        }

        console.error("protectRoute error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};