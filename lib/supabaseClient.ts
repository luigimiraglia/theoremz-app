import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { auth } from "../src/firebase";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase credentials. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env"
  );
}

// Crea il client Supabase con autenticazione Firebase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usa Firebase Auth invece di Supabase Auth
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  realtime: {
    // Configurazione per messaggi in tempo reale
    params: {
      eventsPerSecond: 5,
    },
  },
  global: {
    headers: {
      // Headers di default - saranno sovrascritti dalle chiamate individuali
    },
  },
});

/**
 * Helper per ottenere headers con Firebase token
 * Usare nelle chiamate Supabase che richiedono autenticazione
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) {
    return {};
  }

  try {
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error("Error getting Firebase token:", error);
    return {};
  }
}

/**
 * Crea un client Supabase con il token Firebase corrente
 * Usare questo per chiamate autenticate
 */
export async function getAuthenticatedSupabaseClient() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user");
  }

  const token = await user.getIdToken();

  return createClient(supabaseUrl, supabaseAnonKey, {
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
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
