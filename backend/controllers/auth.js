import User from "../models/user.js";
import generateTokenAndSetcookie from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateUniqueUsername = async (fullName) => {
  let base = fullName.trim().toLowerCase().replace(/\s+/g, ".");
  let username;
  let exists = true;

  while (exists) {
    const suffix = crypto.randomBytes(2).toString("hex");
    username = `${base}.${suffix}`;
    exists = await User.exists({ username });
  }

  return username;
};

export default generateUniqueUsername;

export const signupManual = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      phoneNumber,
      password,
      confirmPassword,
      gender,
    } = req.body;

    if (!fullName || !username || !email || !phoneNumber || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      gender,
    });

    const token = generateTokenAndSetcookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      token
    });
  } catch (error) {
    console.error("Error in manual signup:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const signupGoogle = async (req, res) => {
  try {
    const { fullName, email, googleId } = req.body;

    if (!fullName || !email || !googleId) {
      return res.status(400).json({ error: "Full name, email and googleId are required" });
    }

    // Check if user already exists with googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // User exists, generate token
      const token = generateTokenAndSetcookie(user._id, res);
      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        token
      });
    }

    // Generate a unique username for Google user
    const uniqueUsername = await generateUniqueUsername(fullName);

    const newUser = await User.create({
      fullName,
      username: uniqueUsername,
      email,
      googleId,
    });

    const token = generateTokenAndSetcookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      token
    });
  } catch (error) {
    console.error("Error in Google signup:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // 🔐 Compare plaintext with hashed
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateTokenAndSetcookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const googleLogin = async (req, res) => {
  try {
    // console.log("Incoming body:", req.body);
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code missing" });
    }

    // Exchange code for tokens
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", process.env.GOOGLE_REDIRECT_URI); // must match frontend config
    params.append("grant_type", "authorization_code");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Error exchanging code for token:", tokenData);
      return res.status(400).json({ error: tokenData.error_description || "Failed to exchange code" });
    }

    // Now verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokenData.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Optionally, create new user here
      // Or send error if signup is required
      return res.status(400).json({ error: "User not found. Please signup first." });
    }

    // Generate your app JWT token and set cookie
    const jwtToken = generateTokenAndSetcookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName || name,
      username: user.username,
      email: user.email || email,
      phoneNumber: user.phoneNumber || "",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ error: "Google authentication failed" });
  }
};


export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const changePassword = async (req, res) => {
  try {

    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User details not found" })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePassword controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error in changeEmail controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};