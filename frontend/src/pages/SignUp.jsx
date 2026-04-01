
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import useSignup from "../hooks/useSignup";
import { useAuthContext } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoogleLogin } from "@react-oauth/google";
import { API_BASE } from "@/hooks/api";

const SignUp = () => {
  const { setAuthUser } = useAuthContext();

  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      const { email, name, sub: googleId } = userInfo.data;

      const res = await axios.post(
        `${API_BASE}/auth/google-signup`,
        {
          fullName: name,
          email,
          googleId,
        }
      );

      const data = res.data;
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("web3-ott-user", JSON.stringify(data));
      setAuthUser(data);
      toast.success("Account created successfully!");
    },
    onError: () => {
      console.error("Google login error");
    },
    flow: "implicit",
  });

  const handleGoogleButtonClick = () => {
    handleGoogleSignup();
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 sm:p-6 md:p-10 overflow-hidden bg-gradient-to-br">
      <div className="w-full max-w-md">
        {/* Main Card Container */}
        <div className="w-full backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Card Header */}
          <div className="text-center px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">
                Welcome to CP Battle! 
              </h1>
              <p className="text-blue-100 mt-2 font-medium">
                We're excited to have you join us. Create your account and start
                your journey with us today!
              </p>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-8 py-6">
            <div className="space-y-6">
              {/* Enhanced Google Sign Up Button */}
              <div className="relative">
                <Button
                  type="button"
                  onClick={handleGoogleButtonClick}
                  className="
                    w-full relative
                    bg-gradient-to-r from-white to-gray-50 
                    hover:from-gray-50 hover:to-white
                    border-2 border-gray-200 hover:border-blue-300
                    text-gray-700 hover:text-gray-900
                    shadow-lg hover:shadow-xl
                    transform hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-200 ease-out
                    font-semibold text-base
                    py-3 px-6
                    group
                    rounded-xl
                  "
                >
                  {/* Subtle gradient overlay for extra appeal */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-red-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                  {/* Google Logo with enhanced styling */}
                  <div className="relative flex items-center justify-center gap-3">
                    <svg
                      className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>

                    <span className="relative">
                      Continue with Google
                      {/* Subtle shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                    </span>
                  </div>

                  {/* Attractive border glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-red-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                </Button>
                {/* Subtle promotional text */}
                <p className="text-center text-xs text-green-600 mt-2 font-medium">
                  Low Latency. High Stakes. Real-Time Competition.
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Form Fields Container */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={inputs.fullName}
                      onChange={(e) =>
                        setInputs({ ...inputs, fullName: e.target.value })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={inputs.username}
                      onChange={(e) =>
                        setInputs({ ...inputs, username: e.target.value })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={inputs.email}
                      onChange={(e) =>
                        setInputs({ ...inputs, email: e.target.value })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={inputs.phoneNumber}
                      onChange={(e) =>
                        setInputs({ ...inputs, phoneNumber: e.target.value })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a secure password"
                      value={inputs.password}
                      onChange={(e) =>
                        setInputs({ ...inputs, password: e.target.value })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={inputs.confirmPassword}
                      onChange={(e) =>
                        setInputs({ ...inputs, confirmPassword: e.target.value })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Gender
                    </Label>
                    <Select
                      value={inputs.gender}
                      onValueChange={(value) =>
                        setInputs({ ...inputs, gender: value })
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center py-2">
                  <Link
                    to="/login"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                  >
                    Already have an account? Sign In
                  </Link>
                </div>

                {/* Submit Button */}
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-8 pb-8">
            <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
              <p className="text-center text-sm text-gray-600 leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="https://merchant.razorpay.com/policy/Q0jnnqQgA4S8WG/terms">
                  <span className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer transition-colors duration-200">
                    Terms and Conditions
                  </span>
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;