import { useAuthContext } from "@/context/AuthContext";
import useLogout from "@/hooks/useLogout";

export default function Navbar() {
  const { authUser } = useAuthContext();
  const { logout } = useLogout();

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">BattleCode</h1>

        <div className="flex gap-4">
          {authUser ? (
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-white/10 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-white/10 transition"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}