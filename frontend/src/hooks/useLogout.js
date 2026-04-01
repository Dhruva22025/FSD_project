import { useState } from "react"
import { useAuthContext} from "../context/AuthContext"
import {toast} from "sonner";
import api from "./api"

const useLogout = () => {
  const [loading,setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
        const res = await api.post("/auth/logout");
        const data = await res.data;
        if(data.error){
            throw new Error(data.error);
        }

        localStorage.removeItem("web3-ott-user");
        setAuthUser(null);
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("An unknown error occurred.");
        }
        console.log(error);
    }finally{
        setLoading(false);
    }
  };

  return {loading, logout};
}

export default useLogout;