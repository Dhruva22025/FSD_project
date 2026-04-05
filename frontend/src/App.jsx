import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuthContext } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import Home from "./pages/Home";
import Battle from "./pages/Battle";
import Room from "./pages/Room";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "@/components/layout/Navbar";

function AppLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Navbar />
      <main className="min-h-0 w-full flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}

const GoogleAuthWrapperLogin = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Login />
    </GoogleOAuthProvider>
  );
};

const GoogleAuthWrapperSignUp = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SignUp />
    </GoogleOAuthProvider>
  );
};

function App() {
  const { authUser } = useAuthContext();

  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          {authUser ? (
            <>
              <Route path="/login" element={<Navigate to="/home" replace />} />
              <Route path="/signup" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/battle/:roomId" element={<Battle />} />
              <Route path="/leaderboard/:roomId" element={<Leaderboard />} />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<GoogleAuthWrapperLogin />} />
              <Route path="/signup" element={<GoogleAuthWrapperSignUp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
