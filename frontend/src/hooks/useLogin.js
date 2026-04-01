import { useState } from "react";
import { toast } from "sonner"; // Import Sonner toast
import { useAuthContext } from "../context/AuthContext";
import { API_BASE } from "./api";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username, password) => {
    if (!handleInputErrors(username, password)) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // ✅ Send cookies
      });

      const data = await res.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("web3-ott-user", JSON.stringify(data));
      setAuthUser(data);
      toast.success("Login successful! 🎉"); // Sonner toast for success
    } catch (error) {
      if (error instanceof Error) toast.error(error.message); // Sonner toast for errors
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.warning("Please fill in all fields ⚠️"); // Sonner toast for validation
    return false;
  }
  return true;
}
