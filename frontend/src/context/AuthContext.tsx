import { createContext, useState, useContext } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

// Define the type for the user (can be improved if you know the user shape)
type AuthUser = any; // Replace 'any' with your user type if available

interface AuthContextType {
  authUser: AuthUser;
  setAuthUser: Dispatch<SetStateAction<AuthUser>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthContextProvider");
  return context;
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authUser, setAuthUser] = useState<AuthUser>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("web3-ott-user") || "null");
    }
    return null;
  });

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
