import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "../context/AuthContext";

import { API_BASE } from "./api";

// Define the type for signup input fields



const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async (input) => {
    const success = handleInputErrors(input);
    if (!success) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("code-arena-user", JSON.stringify(data));
      setAuthUser(data);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({
  fullName,
  username,
  email,
  password,
  confirmPassword,
  }){
  if (!fullName || !username || !email || !password || !confirmPassword) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    toast.error("Invalid email format");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return false;
  }

  return true;
}