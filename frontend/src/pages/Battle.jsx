import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import useSubmission from "@/hooks/useSubmission"; // a hook calling /submission/submit
import useRoom from "@/hooks/useRoom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Battle() {
  const { roomId } = useParams();
  const { getRoom } = useRoom();
  const { submitCode } = useSubmission();

  const languages = [
    { id: 50, name: "C" },
    { id: 54, name: "C++" },
    { id: 62, name: "Java" },
    { id: 63, name: "JavaScript (Node.js)" },
    { id: 71, name: "Python 3" },
  ];

  const [room, setRoom] = useState(null);
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState(71); // Python 3 default
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch room info
  useEffect(() => {
    const fetchRoom = async () => {
      const res = await getRoom(roomId);
      if (res.ok) setRoom(res.data.room);
      else setError(res.error);
    };
    fetchRoom();
  }, [roomId]);

  const handleSubmit = async () => {
    if (!code.trim()) return alert("Write some code first!");
    setLoading(true);
    const res = await submitCode({ roomId, code, language_id: languageId });
    setLoading(false);

    if (!res.ok) return alert("✖ " + res.error);

    setResults(res.testCaseResults);
    setWinner(res.winner);
  };

  if (!room) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <h2 className="text-2xl font-bold">{room.problem.title}</h2>
        <p className="text-gray-300">{room.problem.description}</p>

        <h3 className="text-lg font-semibold">Test Cases (inputs only)</h3>
        <ul className="mb-4">
          {room.problem.testCases.map((tc, idx) => (
            <li key={idx} className="text-gray-400">
              Input: {tc.input}
            </li>
          ))}
        </ul>

        <div>
          <h3 className="font-semibold mb-2">Your Code</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Language</label>
            <Select value={languageId.toString()} onValueChange={(value) => setLanguageId(parseInt(value))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id.toString()}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <textarea
            rows={10}
            className="w-full p-2 bg-gray-900 rounded text-white font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 rounded mt-2"
          disabled={loading}
        >
          {loading ? "Running..." : "Submit"}
        </button>

        {results.length > 0 && (
          <div className="mt-6 border-t border-gray-800 pt-4 space-y-4">
            <h3 className="text-xl font-bold">Test Case Results</h3>
            {results.map((tc, idx) => (
              <div key={idx} className="p-4 border border-gray-700 rounded">
                <p><strong>Input:</strong> {tc.input}</p>
                <p><strong>Expected:</strong> {tc.expected}</p>
                <p><strong>Output:</strong> {tc.output}</p>
                {tc.compileError && (
                  <p className="text-red-400"><strong>Compile Error:</strong> {tc.compileError}</p>
                )}
                {tc.runtimeError && (
                  <p className="text-red-400"><strong>Runtime Error:</strong> {tc.runtimeError}</p>
                )}
                <p>
                  <strong>Passed:</strong>{" "}
                  <span className={tc.passed ? "text-green-400" : "text-red-400"}>
                    {tc.passed ? "✅" : "❌"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {winner && (
          <div className="mt-6 p-4 bg-green-700 rounded">
            🏆 Winner: {winner === localStorage.getItem("code-arena-user") ? "You!" : winner}
          </div>
        )}
      </div>
    </div>
  );
}