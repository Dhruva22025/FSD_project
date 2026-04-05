export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white overflow-x-hidden">

      {/* 🔥 HERO SECTION */}
      <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] text-center px-6">

        {/* 🌈 Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl animate-pulse top-[-100px] left-[-100px]"></div>
          <div className="absolute w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl animate-pulse bottom-[-100px] right-[-100px]"></div>
        </div>

        {/* ✨ Floating dots */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* 🧠 CONTENT */}
        <div className="relative z-10 max-w-4xl pt-24">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Where Algorithms <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text animate-pulse">
              Meet Adrenaline
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Real-time coding battles. Compete, solve, and dominate the leaderboard.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:scale-105 transition">
              Start Battle ⚔️
            </a>
            <a className="px-6 py-3 border border-gray-700 rounded-xl hover:bg-white/10 transition">
              Explore Platform
            </a>
          </div>
        </div>
      </section>

      {/* ⚡ FEATURES */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          {[
            "Real-Time Battles",
            "Live Code Sync",
            "Smart Matchmaking",
            "Global Leaderboard",
            "Low Latency Engine",
            "Secure Execution"
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 border border-gray-800 rounded-2xl hover:scale-105 hover:border-purple-500 transition duration-300"
            >
              <h3 className="text-xl font-semibold">{feature}</h3>
              <p className="text-gray-400 mt-2">
                Built for competitive developers who want real challenges.
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* 🏆 CTA */}
      <section className="py-20 text-center border-t border-gray-800">
        <h2 className="text-4xl font-bold">Ready to Battle?</h2>
        <p className="text-gray-400 mt-4">
          Join thousands of developers competing live.
        </p>

        <button className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:scale-105 transition">
          Enter Arena 🚀
        </button>
      </section>

      {/* 🔚 FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-gray-800">
        © 2026 BattleCode. All rights reserved.
      </footer>
    </div>
  );
}