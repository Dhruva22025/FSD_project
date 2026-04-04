import { useAuthContext } from "@/context/AuthContext";
import useLogout from "@/hooks/useLogout";

export default function HomePage() {
  const { authUser } = useAuthContext();
  const logout = useLogout();

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">

      {/* 🔝 NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">BattleCode</h1>

          <div className="flex gap-4">
            {authUser ? (
              <div>
                <button onClick={logout} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-white/10 transition">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <a href="/login" className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-white/10 transition">
                  Login
                </a>
                <a href="/signup" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 🔥 HERO */}
      <section className="relative flex items-center justify-center min-h-screen text-center px-6">

        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
          <div className="absolute w-[500px] h-[500px] bg-blue-600/30 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-4xl pt-24">
          <h1 className="text-5xl md:text-6xl font-bold">
            Compete. Compute. Conquer.
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Real-time coding battles with live leaderboard, matchmaking,
            and instant code execution.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:scale-105 transition">
              Start Battle ⚔️
            </a>
            <a className="px-6 py-3 border border-gray-700 rounded-xl hover:bg-white/10 transition">
              Explore
            </a>
          </div>
        </div>
      </section>

      {/* ⚡ STATS */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-8 px-6">
          {[
            ["10K+", "Battles"],
            ["5K+", "Users"],
            ["100+", "Problems"],
            ["<100ms", "Latency"],
          ].map(([num, label], i) => (
            <div key={i}>
              <h2 className="text-3xl font-bold text-purple-400">{num}</h2>
              <p className="text-gray-400 mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Competitive Developers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Real-Time Battles",
              "Live Code Sync",
              "Smart Matchmaking",
              "Instant Execution",
              "Global Leaderboard",
              "Secure Sandbox",
            ].map((f, i) => (
              <div key={i} className="p-6 bg-white/5 border border-gray-800 rounded-2xl hover:border-purple-500 hover:scale-105 transition">
                <h3 className="text-xl font-semibold">{f}</h3>
                <p className="text-gray-400 mt-2">
                  Experience next-gen competitive coding.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔄 HOW IT WORKS */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-5 gap-6 text-sm">
            {[
              "Login",
              "Join Room",
              "Lobby Ready",
              "Battle",
              "Win & Rank",
            ].map((step, i) => (
              <div key={i} className="p-4 border border-gray-800 rounded-xl bg-white/5">
                <div className="text-purple-400 text-xl font-bold mb-2">{i + 1}</div>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏆 CTA */}
      <section className="py-20 text-center border-t border-gray-800">
        <h2 className="text-4xl font-bold">
          Ready to Enter the Arena?
        </h2>
        <p className="text-gray-400 mt-4">
          Compete with developers worldwide in real-time.
        </p>

        <button className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:scale-105 transition">
          Join Now 🚀
        </button>
      </section>

      {/* 🔚 FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-gray-800">
        © 2026 BattleCode. Built for competitors.
      </footer>
    </div>
  );
}