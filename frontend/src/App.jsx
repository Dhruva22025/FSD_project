import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuthContext } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import Home from "./pages/Home";
import { useAuthContext } from "./context/AuthContext";

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
      {authUser ? (

        <div className="flex min-h-screen w-full">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          </header>
          <main className="flex-1 p-4 lg:p-6">
            <Routes>
              <Route path="/login" element={<Navigate to={"/home"} />} />
              <Route path="/signup" element={<Navigate to={"/home"} />} />
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<GoogleAuthWrapperLogin />} />
          <Route path="/signup" element={<GoogleAuthWrapperSignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;