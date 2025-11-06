// serve ad avere il context dell'auth sempre disponibile nella'app
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { supabase } from "../lib/supabaseClient";

// tipi e valore di default per il context
type Status = "checking" | "guest" | "authed";
type UserWithRole = User & { role?: "student" | "tutor" };
type Ctx = { 
  status: Status; 
  user: UserWithRole | null; 
  logout: () => Promise<void> 
};

const AuthCtx = createContext<Ctx>({
  status: "checking",
  user: null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");
  const [user, setUser] = useState<UserWithRole | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Carica il ruolo dell'utente da Supabase
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", u.uid)
            .single();
          
          const userWithRole: UserWithRole = {
            ...u,
            role: profile?.role || "student", // Default a studente
          };
          setUser(userWithRole);
        } catch (err) {
          console.error("Error fetching user role:", err);
          setUser({ ...u, role: "student" });
        }
      } else {
        setUser(null);
      }
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
