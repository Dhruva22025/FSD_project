import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useAuthContext } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { Input } from "@/components/ui/input";
import { API_BASE } from "@/hooks/api";

const Login = () => {
  const { setAuthUser } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  const responseGoogle = async (credentialResponse) => {
    try {
      const authCode = credentialResponse.code;

      const backendRes = await fetch(`${API_BASE}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: authCode }),
      });

      const result = await backendRes.json();
      if (!backendRes.ok) throw new Error(result.error);

      localStorage.setItem("code-arena-user", JSON.stringify(result));
      setAuthUser(result);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (err) => console.error("Google Sign In Error", err),
    flow: "auth-code",
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* 🌈 Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-purple-600/30 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-600/30 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>
      </div>

      {/* 💎 Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

        {/* 🔥 Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome Back ⚡
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Continue your battle journey
          </p>
        </div>

        {/* ⚡ Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-700 hover:bg-white/10 transition mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..."
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* 🧠 FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-black/40 border-gray-700 focus:border-purple-500 text-white"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black/40 border-gray-700 focus:border-purple-500 text-white"
          />

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 hover:text-purple-400"
            >
              Forgot password?
            </Link>
          </div>

          {/* 🚀 Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold hover:scale-105 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* 🔗 Signup */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;