import CreateRoom from "@/components/rooms/CreateRoom";
import JoinRoom from "@/components/rooms/JoinRoom";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Create a room or join using a code
          </p>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <CreateRoom />
          <JoinRoom />
        </div>
      </div>
    </div>
  );
}