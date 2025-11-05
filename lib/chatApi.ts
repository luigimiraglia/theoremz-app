import { RealtimeChannel } from "@supabase/supabase-js";
import { auth } from "../src/firebase";
import { getAuthenticatedSupabaseClient, supabase } from "./supabaseClient";

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
  let query = supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
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

  return (data || []) as Message[];
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
  onInsert: (message: Message) => void
): () => void {
  const channelName = `messages:${conversationId}`;

  const channel: RealtimeChannel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        console.log("New message received:", payload);
        if (payload.new) {
          onInsert(payload.new as Message);
        }
      }
    )
    .subscribe((status) => {
      console.log(`Realtime subscription status: ${status}`);
    });

  // Ritorna funzione di cleanup
  return () => {
    console.log("Unsubscribing from", channelName);
    supabase.removeChannel(channel);
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

  const { data, error } = await supabase
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

  const authSupabase = await getAuthenticatedSupabaseClient();

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
