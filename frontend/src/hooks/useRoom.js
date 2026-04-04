import { useState } from "react";
import api from "@/hooks/api";

export default function useRoom() {
  const [loading, setLoading] = useState(false);

  // ─── Room APIs ───────────────────────────────────────────────
  const createRoom = async () => {
    try {
      setLoading(true);
      const res = await api.post("/rooms/create");
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Error creating room",
      };
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomCode) => {
    try {
      setLoading(true);
      const res = await api.post("/rooms/join", { roomCode });
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Error joining room",
      };
    } finally {
      setLoading(false);
    }
  };

  const startRoom = async (roomId) => {
    try {
      const res = await api.post("/rooms/start", { roomId });
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Error starting match",
      };
    }
  };

  const getRoom = async (roomId) => {
    try {
      const res = await api.get(`/rooms/${roomId}`);
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Error fetching room",
      };
    }
  };

  // ─── Host: Set Problem ──────────────────────────────────────
  const setProblem = async (roomId, { title, description, testCases }) => {
    try {
      const res = await api.post("/rooms/set-problem", {
        roomId,
        title,
        description,
        testCases,
      });
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Error setting problem",
      };
    }
  };

  // ─── Submit Code ────────────────────────────────────────────
  const submitCode = async (roomId, code, language_id) => {
    setLoading(true);
    try {
      const res = await api.post("/submission/submit", {
        roomId,
        code,
        language_id,
      });
      setLoading(false);
      return { ok: true, ...res.data };
    } catch (err) {
      setLoading(false);
      return {
        ok: false,
        error: err.response?.data?.message || "Error submitting code",
      };
    }
  };

  return {
    createRoom,
    joinRoom,
    startRoom,
    getRoom,
    setProblem,
    submitCode,
    loading,
  };
}