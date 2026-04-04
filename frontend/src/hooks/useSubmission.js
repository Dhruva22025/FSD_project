import { useState } from "react";
import api from "@/hooks/api"; // your axios instance

export default function useSubmission() {
  const [loading, setLoading] = useState(false);

  const submitCode = async ({ roomId, code, language_id }) => {
    try {
      setLoading(true);
      const res = await api.post("/submission/submit", {
        roomId,
        code,
        language_id,
      });

      return {
        ok: true,
        testCaseResults: res.data.testCaseResults,
        winner: res.data.winner,
        isCorrect: res.data.isCorrect,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Submission failed",
      };
    } finally {
      setLoading(false);
    }
  };

  return { submitCode, loading };
}