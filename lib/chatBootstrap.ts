import { auth } from "../src/firebase";
import { supabase } from "./supabaseClient";

/**
 * Bootstrap della chat per lo studente
 * 1. Verifica autenticazione Firebase
 * 2. Assicura che il profilo esista (usa Firebase UID come ID)
 * 3. Ottiene/crea la conversazione per questo studente
 *
 * @returns ID della conversazione
 */
export async function bootstrapStudentChat(): Promise<string> {
  // 1. Verifica che l'utente sia autenticato
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated with Firebase");
  }

  try {
    console.log("Bootstrapping chat for user:", user.uid);

    // 2. Assicura che il profilo esista
    // Usa Firebase UID come ID del profilo
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.uid, // Firebase UID come primary key
          email: user.email,
          full_name: user.displayName || user.email?.split("@")[0] || "Student",
          avatar_url: user.photoURL || null,
          role: "student",
          subscription_tier: "free",
          email_verified: user.emailVerified,
        },
        {
          onConflict: "id",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (profileError) {
      console.error("Error ensuring profile:", profileError);
      throw new Error(`Failed to ensure profile: ${profileError.message}`);
    }

    console.log("Profile ensured:", profileData);

    // 3. Cerca conversazione esistente per questo studente
    const { data: existingConversation, error: searchError } = await supabase
      .from("conversations")
      .select("id, created_at")
      .eq("student_id", user.uid)
      .limit(1)
      .maybeSingle();

    if (searchError) {
      console.error("Error searching conversation:", searchError);
      throw new Error(`Failed to search conversation: ${searchError.message}`);
    }

    // 4. Se esiste, ritorna l'ID
    if (existingConversation) {
      console.log("Found existing conversation:", existingConversation.id);
      return existingConversation.id;
    }

    // 5. Altrimenti crea nuova conversazione
    const { data: newConversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        student_id: user.uid,
        status: "open", // Provo con "open" invece di "active"
      })
      .select()
      .single();

    if (conversationError) {
      console.error("Error creating conversation:", conversationError);
      throw new Error(
        `Failed to create conversation: ${conversationError.message}`
      );
    }

    console.log("Created new conversation:", newConversation.id);

    return newConversation.id;
  } catch (error: any) {
    console.error("Bootstrap chat error:", error);

    // Messaggi di errore più specifici
    if (error.message?.includes("email_verified")) {
      throw new Error(
        "Email non verificata. Verifica la tua email prima di accedere alla chat."
      );
    }

    if (error.message?.includes("subscription_tier")) {
      throw new Error(
        "Abbonamento richiesto. Acquista un abbonamento per accedere alla chat."
      );
    }

    throw error;
  }
}

/**
 * Verifica se l'utente ha accesso alla chat
 * Controlla email verificata e tier di abbonamento
 */
export async function checkChatAccess(): Promise<{
  hasAccess: boolean;
  reason?: string;
}> {
  const user = auth.currentUser;

  if (!user) {
    return { hasAccess: false, reason: "Not authenticated" };
  }

  // Verifica email
  if (!user.emailVerified) {
    return {
      hasAccess: false,
      reason: "Email non verificata",
    };
  }

  // Qui potresti aggiungere una chiamata per verificare subscription_tier
  // Per ora assumiamo che l'RPC policy lo gestisca

  return { hasAccess: true };
}
