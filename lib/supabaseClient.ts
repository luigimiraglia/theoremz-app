import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { auth } from "../src/firebase";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase credentials. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env"
  );
}

// Client Supabase base (per operazioni pubbliche e realtime)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 5,
    },
  },
});

/**
 * Ottiene un client Supabase autenticato con il token Firebase
 * Questo client rispetta le policy RLS usando il JWT di Firebase
 */
export async function getAuthenticatedClient(): Promise<SupabaseClient> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  // Crea un nuovo client con il token Firebase nell'header
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
