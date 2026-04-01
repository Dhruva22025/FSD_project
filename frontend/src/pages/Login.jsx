import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
      console.log("Google Auth Code:", authCode);

      if (!authCode) {
        throw new Error("No auth code received from Google.");
      }

      const backendRes = await fetch(
        `${API_BASE}/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code: authCode }),
        }
      );

      const result = await backendRes.json();
      if (!backendRes.ok) throw new Error(result.error || "Login failed");

      const data = result;
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("web3-ott-user", JSON.stringify(data));
      setAuthUser(data);
      // Assuming toast is imported from a library like react-hot-toast
      // toast.success("Account created successfully!");
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
    <div className="flex  w-full items-center justify-center   bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-border backdrop-blur-md bg-background/80">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome to Competitve Coding Platform
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              type="button"
              variant="default"
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md"
              onClick={handleGoogleLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign in with credentials
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  className="w-full h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background text-foreground border-border"
                  value={username}
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  className="w-full h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background text-foreground border-border"
                  value={password}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full h-10 text-base font-medium border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
              >
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;