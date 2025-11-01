// app/_layout.tsx
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/auth";

export default function Root() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

function Gate() {
  const { status, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log(
      "Gate - Status:",
      status,
      "User:",
      user?.email,
      "Segments:",
      segments
    );

    if (status === "checking") return;

    const inAuth = segments[0] === "(auth)";

    // Se sei guest e NON sei nella sezione auth, vai al login
    if (status === "guest" && !inAuth) {
      console.log("Redirecting to login (guest, not in auth)");
      router.replace("/(auth)/login");
    }
    // Se sei autenticato e SEI nella sezione auth, vai alla home
    else if (status === "authed" && inAuth) {
      console.log("Redirecting to home (authed, in auth section)");
      router.replace("/(app)/(tabs)/home");
    }
    // Se sei guest e SEI in auth, rimani lì (nessun redirect)
    // Se sei authed e NON sei in auth, rimani lì (nessun redirect)
  }, [status, segments, router, user]);

  // Non mostrare niente durante il checking o se devi fare redirect
  if (status === "checking") {
    return null;
  }

  const inAuth = segments[0] === "(auth)";
  
  // Non mostrare niente se stai per essere reindirizzato
  if (status === "guest" && !inAuth) {
    return null;
  }
  if (status === "authed" && inAuth) {
    return null;
  }

  return <Slot />;
}
