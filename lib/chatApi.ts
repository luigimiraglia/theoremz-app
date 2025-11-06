import { RealtimeChannel } from "@supabase/supabase-js";
import { auth } from "../src/firebase";
import { getAuthenticatedClient, supabase } from "./supabaseClient";

/**
 * Tipo per i messaggi della chat
 */
export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

/**
 * Recupera i messaggi di una conversazione
 *
 * @param conversationId - ID della conversazione
 * @param limit - Numero massimo di messaggi da recuperare (default: 50)
 * @param before - Timestamp per paginazione (messaggi prima di questa data)
 * @returns Array di messaggi ordinati per data ascendente
 */
export async function fetchMessages(
  conversationId: string,
  limit: number = 50,
  before?: string
): Promise<Message[]> {
  // Usa client autenticato per RLS
  const authClient = await getAuthenticatedClient();

  let query = authClient
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  // Paginazione: messaggi prima di una certa data
  if (before) {
    query = query.lt("created_at", before);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  // Inverti l'array per mostrare i messaggi dal più vecchio al più recente
  return data ? data.reverse() : [];
}

/**
 * Subscribe ai nuovi messaggi in tempo reale
 *
 * @param conversationId - ID della conversazione
 * @param onInsert - Callback chiamata quando arriva un nuovo messaggio
 * @returns Funzione per annullare la subscription
 */
export function subscribeMessages(
  conversationId: string,
  callback: (message: Message) => void
): () => void {
  console.log(
    "[subscribeMessages] Subscribing to conversation:",
    conversationId
  );

  const channel: RealtimeChannel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        console.log("[Realtime] Received INSERT event:", payload);
        if (payload.new) {
          callback(payload.new as Message);
        }
      }
    )
    .subscribe((status) => {
      console.log("[Realtime] Subscription status:", status);
    });

  return () => {
    console.log(
      "[subscribeMessages] Unsubscribing from conversation:",
      conversationId
    );
    channel.unsubscribe();
  };
}

/**
 * Invia un nuovo messaggio nella conversazione
 *
 * @param conversationId - ID della conversazione
 * @param body - Contenuto del messaggio
 * @returns Il messaggio creato
 */
export async function sendMessage(
  conversationId: string,
  body: string
): Promise<Message> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Usa client autenticato per RLS
  const authClient = await getAuthenticatedClient();

  const { data, error } = await authClient
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.uid,
      body: body.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(`Failed to send message: ${error.message}`);
  }

  if (!data) {
    throw new Error("No data returned after sending message");
  }

  return data as Message;
}

/**
 * Carica messaggi più vecchi per paginazione
 *
 * @param conversationId - ID della conversazione
 * @param oldestMessageDate - Data del messaggio più vecchio attualmente visibile
 * @param limit - Numero di messaggi da caricare (default: 20)
 */
export async function loadMoreMessages(
  conversationId: string,
  oldestMessageDate: string,
  limit: number = 20
): Promise<Message[]> {
  return fetchMessages(conversationId, limit, oldestMessageDate);
}

/**
 * Elimina un messaggio (se l'utente è il sender)
 *
 * @param messageId - ID del messaggio
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const authSupabase = await getAuthenticatedClient();

  const { error } = await authSupabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", user.uid); // Solo il sender può eliminare

  if (error) {
    console.error("Error deleting message:", error);
    throw new Error(`Failed to delete message: ${error.message}`);
  }
}

/**
 * Recupera tutte le conversazioni (solo per tutor)
 * Ritorna lista di conversazioni con ultimo messaggio e info studente
 */
export async function fetchAllConversations(): Promise<any[]> {
  const authClient = await getAuthenticatedClient();

  // Recupera solo le conversazioni e i messaggi
  const { data, error } = await authClient
    .from("conversations")
    .select(`
      id,
      created_at,
      updated_at,
      student_id,
      messages(
        id,
        body,
        created_at,
        sender_id
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }

  // Recupera i profili degli studenti in batch
  const studentIds = (data || []).map((conv: any) => conv.student_id);
  const { data: profiles, error: profilesError } = await authClient
    .from("profiles")
    .select("id, email, full_name, avatar_url")
    .in("id", studentIds);

  if (profilesError) {
    console.error("Error fetching student profiles:", profilesError);
    throw new Error(`Failed to fetch student profiles: ${profilesError.message}`);
  }

  // Mappa i profili agli id
  const profilesMap = Object.fromEntries(
    (profiles || []).map((p: any) => [p.id, p])
  );

  // Aggiungi l'ultimo messaggio e il profilo studente a ogni conversazione
  return (data || []).map((conv: any) => ({
    ...conv,
    lastMessage: conv.messages?.[conv.messages.length - 1] || null,
    student: profilesMap[conv.student_id] || null,
  }));
}
