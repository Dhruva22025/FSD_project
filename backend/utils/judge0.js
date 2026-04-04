import axios from "axios";

const JUDGE0_URL = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

export const runCode = async ({ source_code, language_id, stdin }) => {
  try {
    const res = await axios.post(JUDGE0_URL, {
      source_code,
      language_id,
      stdin,
    });

    return res.data;
  } catch (err) {
    console.error("Judge0 Error:", err);
    throw new Error("Judge0 execution failed");
  }
};