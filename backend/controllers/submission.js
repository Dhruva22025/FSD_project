import Submission from "../models/submission.js";
import Room from "../models/room.js";
import { runCode } from "../utils/judge0.js";

// 🚀 SUBMIT CODE
// ─── Helper to normalize output ─────────────────────────────

export const submitCode = async (req, res) => {
  try {
    const { roomId, code, language_id } = req.body;
    const userId = req.user._id;

    const room = await Room.findById(roomId);

    if (!room || !room.problem) {
      return res.status(400).json({ message: "Problem not set" });
    }

    let allPassed = true;
    const testCaseResults = [];

    // console.log(`\n===== Submission by ${userId} =====`);
    // console.log("Code:\n", code);

    for (let i = 0; i < room.problem.testCases.length; i++) {
      const tc = room.problem.testCases[i];

      // Run code on Judge0
      const result = await runCode({
        source_code: code,
        language_id,
        stdin: tc.input,
      });

      const output = result.stdout?.trim() || "";
      const compileError = result.compile_output?.trim() || "";
      const runtimeError = result.stderr?.trim() || "";

      const passed = output === tc.output.trim() && !compileError && !runtimeError;
      if (!passed) allPassed = false;

      testCaseResults.push({
        input: tc.input,
        expected: tc.output,
        output,
        passed,
        compileError,
        runtimeError,
      });

      // log detailed info for debugging
      // console.log(`--- Test Case ${i + 1} ---`);
      // console.log("Input:", tc.input);
      // console.log("Expected:", tc.output);
      // console.log("Output:", output);
      // if (compileError) console.log("Compile Error:", compileError);
      // if (runtimeError) console.log("Runtime Error:", runtimeError);
      // console.log("Passed:", passed);
    }

    // Save submission in DB
    const submission = await Submission.create({
      userId,
      roomId,
      code,
      isCorrect: allPassed,
      testCaseResults,
    });

    // Set winner if all passed and no winner yet
    if (allPassed && !room.winner) {
      room.winner = userId;
      await room.save();
      // console.log("🏆 Winner:", userId);
    }

    res.json({
      success: true,
      isCorrect: allPassed,
      winner: room.winner,
      testCaseResults, // send all logs to frontend
    });
  } catch (err) {
    console.error("Submit Code Error:", err);
    res.status(500).json({ message: "Execution error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { roomId } = req.params;

    const submissions = await Submission.find({ roomId, isCorrect: true })
      .populate("userId", "username")
      .sort({ createdAt: 1 }); // earliest correct submission first

    res.json({ success: true, submissions });
  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};