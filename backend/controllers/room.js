import Room from "../models/room.js";
import crypto from "crypto";

// 🔑 generate 6-digit room code
const generateRoomCode = () => {
  return crypto.randomBytes(3).toString("hex"); // e.g. 'a1b2c3'
};

// 🏠 CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const username = req.user.username;

    const roomCode = generateRoomCode();

    const room = await Room.create({
      roomCode,
      host: userId,
      players: [{ userId, username }],
    });

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Create Room Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🚪 JOIN ROOM
export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const userId = req.user._id;
    const username = req.user.username;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // prevent duplicate join
    const alreadyJoined = room.players.find(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!alreadyJoined) {
      room.players.push({ userId, username });
      await room.save();
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Join Room Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ▶ START MATCH (host only)
export const startRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // only host can start
    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only host can start" });
    }

    room.status = "active";
    await room.save();

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Start Room Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 📄 GET ROOM DETAILS
export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get Room Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const setProblem = async (req, res) => {
  try {
    const { roomId, title, description, testCases } = req.body;

    const room = await Room.findById(roomId);

    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only host can set problem" });
    }

    room.problem = { title, description, testCases };
    await room.save();

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: "Error setting problem" });
  }
};