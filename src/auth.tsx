// serve ad avere il context dell'auth sempre disponibile nella'app
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

// tipi e valore di default per il context
type Status = "checking" | "guest" | "authed";
type Ctx = { status: Status; user: User | null; logout: () => Promise<void> };

const AuthCtx = createContext<Ctx>({
  status: "checking",
  user: null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setStatus(u ? "authed" : "guest");
    });
  }, []);

  const logout = async () => {
    await signOut(auth);
  };
  return (
    <AuthCtx.Provider value={{ status, user, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => useContext(AuthCtx);
