import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/hooks/api";

export default function Leaderboard() {
  const { roomId } = useParams();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`/submission/leaderboard/${roomId}`);
        if (res.data.success) setSubs(res.data.submissions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [roomId]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
        {subs.length === 0 && <p>No correct submissions yet.</p>}

        <ul className="space-y-4">
          {subs.map((s, idx) => (
            <li key={s._id} className="p-4 border border-gray-800 rounded">
              <p>
                <strong>Rank #{idx + 1}</strong> - {s.userId.username}
              </p>
              <p>Submitted at: {new Date(s.createdAt).toLocaleTimeString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}