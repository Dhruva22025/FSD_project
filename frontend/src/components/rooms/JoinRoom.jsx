import { useState } from "react";
import useRoom from "@/hooks/useRoom";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const { joinRoom, loading } = useRoom();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!code.trim()) return;

    const res = await joinRoom(code);

    if (res.ok) {
      navigate(`/room/${res.data.room._id}`);
    } else {
      alert("✖ " + res.error);
    }
  };

  return (
    <div className="p-6 border border-gray-800 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Join Room</h2>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter room code"
        className="w-full mb-4 px-4 py-2 bg-black border border-gray-700 rounded-lg"
      />

      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full py-3 bg-blue-600 rounded-lg hover:opacity-90"
      >
        {loading ? "Joining..." : "Join Room"}
      </button>
    </div>
  );
}