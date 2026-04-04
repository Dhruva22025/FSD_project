import useRoom from "@/hooks/useRoom";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const { createRoom, loading } = useRoom();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const res = await createRoom();

    if (res.ok) {
      navigate(`/room/${res.data.room._id}`);
    } else {
      alert("✖ " + res.error);
    }
  };

  return (
    <div className="p-6 border border-gray-800 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Create Room</h2>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-3 bg-purple-600 rounded-lg hover:opacity-90"
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </div>
  );
}