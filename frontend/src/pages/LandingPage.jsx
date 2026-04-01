export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🔝 NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <h1 className="text-xl font-bold tracking-tight">BattleCode</h1>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="px-5 py-2 rounded-lg border border-gray-700 hover:bg-white/10 transition"
            >
              Login
            </a>

            <a
              href="/signup"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 font-medium hover:opacity-90 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* 🔥 HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-transparent blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Where Algorithms <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Meet Adrenaline
            </span>
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Compete in real-time coding battles. Solve problems faster, climb
            the leaderboard, and prove your skills against the best.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition">
              Start Battle
            </button>
            <button className="px-6 py-3 border border-gray-700 rounded-xl hover:bg-white/10 transition">
              Explore Arena
            </button>
          </div>
        </div>
      </section>

      {/* ⚡ STATS SECTION */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["10K+", "Battles Played"],
            ["5K+", "Developers"],
            ["100+", "Problems"],
            ["99.9%", "Uptime"],
          ].map(([value, label], i) => (
            <div key={i}>
              <h2 className="text-3xl font-bold text-purple-400">{value}</h2>
              <p className="text-gray-400 mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 FEATURES SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Competitive Minds
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-Time Battles",
                desc: "Compete live against developers worldwide with zero delay matchmaking.",
              },
              {
                title: "Smart Matchmaking",
                desc: "AI-powered pairing ensures fair and challenging opponents.",
              },
              {
                title: "Live Leaderboards",
                desc: "Track your rank, performance, and progress instantly.",
              },
              {
                title: "Code Execution Engine",
                desc: "Run, test, and validate solutions in milliseconds.",
              },
              {
                title: "Skill-Based Ranking",
                desc: "Your rank reflects your true coding ability.",
              },
              {
                title: "Global Arena",
                desc: "Battle developers from across the world anytime.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-purple-500 transition"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏆 CTA SECTION */}
      <section className="py-20 text-center border-t border-gray-800">
        <h2 className="text-4xl font-bold">Ready to Prove Your Skills?</h2>
        <p className="text-gray-400 mt-4">
          Join thousands of developers competing in real-time coding battles.
        </p>

        <button className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-lg hover:scale-105 transition">
          Join the Arena 🚀
        </button>
      </section>

      {/* 🔚 FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-gray-800">
        © 2026 BattleCode. Built for developers.
      </footer>
    </div>
  );
}
