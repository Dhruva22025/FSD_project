import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRoom from "@/hooks/useRoom";
export default function Room() {
    const { roomId } = useParams();
    const { getRoom, startRoom, setProblem } = useRoom();

    const [room, setRoom] = useState(null);
    const [error, setError] = useState("");
    const [problemData, setProblemData] = useState({
        title: "",
        description: "",
        testCases: [{ input: "", output: "" }],
    });

    // ─── Fetch room and poll ─────────────────────────────────────────────
    useEffect(() => {
        let interval;

        const fetchRoom = async () => {
            const res = await getRoom(roomId);
            if (res.ok) {
                setRoom(res.data.room);

                // Fill host form with existing problem if already set
                if (res.data.room.problem?.title) {
                    setProblemData({
                        title: res.data.room.problem.title,
                        description: res.data.room.problem.description,
                        testCases: res.data.room.problem.testCases || [{ input: "", output: "" }],
                    });
                }

                // Auto redirect when match starts
                if (res.data.room.status === "active") {
                    window.location.href = `/battle/${roomId}`;
                }
            }
        };

        fetchRoom();
        interval = setInterval(fetchRoom, 2000);
        return () => clearInterval(interval);
    }, [roomId]);

    const isHost = room?.host === localStorage.getItem("code-arena-user"); // or from auth context

    // ─── Handlers ───────────────────────────────────────────────────────
    const handleStart = async () => {
        const res = await startRoom(roomId);
        if (!res.ok) return alert("✖ " + res.error);
        window.location.href = `/battle/${roomId}`;
    };

    const handleSetProblem = async () => {
        const res = await setProblem(roomId, problemData);
        if (!res.ok) return alert("✖ " + res.error);
        alert("Problem set successfully ✅");
        setRoom(res.data.room);
    };

    const handleTestCaseChange = (index, field, value) => {
        const updated = [...problemData.testCases];
        updated[index][field] = value;
        setProblemData({ ...problemData, testCases: updated });
    };

    const addTestCase = () => {
        setProblemData({
            ...problemData,
            testCases: [...problemData.testCases, { input: "", output: "" }],
        });
    };

    if (error) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-black p-6 text-red-400">
                ✖ {error}
            </div>
        );
    }
    if (!room) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold mb-4">Room Code: {room.roomCode}</h2>

                <div className="border border-gray-800 rounded-xl p-6 mb-6">
                    <h3 className="mb-4 font-semibold">Players</h3>
                    <ul className="space-y-2">
                        {room.players.map((p) => (
                            <li key={p.userId} className="text-gray-300">{p.username}</li>
                        ))}
                    </ul>
                </div>

                {/* ─── Host: Set Problem ───────────────────────────── */}
                {room.status === "waiting" && (
                    <div className="border border-gray-800 rounded-xl p-6 mb-6">
                        <h3 className="mb-4 font-semibold">Set Problem</h3>
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full mb-2 p-2 bg-gray-900 rounded"
                            value={problemData.title}
                            onChange={(e) =>
                                setProblemData({ ...problemData, title: e.target.value })
                            }
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full mb-2 p-2 bg-gray-900 rounded"
                            rows={4}
                            value={problemData.description}
                            onChange={(e) =>
                                setProblemData({ ...problemData, description: e.target.value })
                            }
                        />
                        <h4 className="mb-2 font-semibold">Test Cases</h4>
                        {problemData.testCases.map((tc, idx) => (
                            <div key={idx} className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Input"
                                    className="w-full mb-1 p-2 bg-gray-800 rounded"
                                    value={tc.input}
                                    onChange={(e) =>
                                        handleTestCaseChange(idx, "input", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Expected Output"
                                    className="w-full mb-1 p-2 bg-gray-800 rounded"
                                    value={tc.output}
                                    onChange={(e) =>
                                        handleTestCaseChange(idx, "output", e.target.value)
                                    }
                                />
                            </div>
                        ))}
                        <button
                            onClick={addTestCase}
                            className="px-4 py-2 bg-blue-600 rounded mb-2"
                        >
                            + Add Test Case
                        </button>
                        <button
                            onClick={handleSetProblem}
                            className="px-6 py-3 bg-green-600 rounded-lg ml-2"
                        >
                            Set Problem
                        </button>
                    </div>
                )}

                {/* ─── Display problem for all players ───────────────────────────── */}
                {room.problem?.title && (
                    <div className="border border-gray-800 rounded-xl p-6 mb-6">
                        <h3 className="mb-2 font-semibold text-lg">{room.problem.title}</h3>
                        <p className="mb-2 text-gray-300">{room.problem.description}</p>
                        <h4 className="mb-2 font-semibold">Test Cases (inputs only)</h4>
                        <ul className="mb-2">
                            {room.problem.testCases.map((tc, idx) => (
                                <li key={idx} className="text-gray-300">
                                    Input: {tc.input}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={handleStart}
                    className="px-6 py-3 bg-green-600 rounded-lg"
                    disabled={!room.problem?.title && isHost}
                >
                    Start Match
                </button>
            </div>
        </div>
    );
}