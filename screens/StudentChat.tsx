import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  fetchMessages,
  loadMoreMessages,
  Message,
  sendMessage,
  subscribeMessages,
} from "../lib/chatApi";
import { bootstrapStudentChat } from "../lib/chatBootstrap";
import { useAuth } from "../src/auth";

export default function StudentChat() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Message>>(null);

  // State
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Bootstrap: inizializza conversazione al mount
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function init() {
      if (!user) {
        setError("Devi essere autenticato per accedere alla chat");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Bootstrap: ensure_profile + open_or_get_conversation
        const convId = await bootstrapStudentChat();
        setConversationId(convId);

        // 2. Carica messaggi esistenti
        const initialMessages = await fetchMessages(convId, 50);
        setMessages(initialMessages);

        // 3. Subscribe ai nuovi messaggi in tempo reale
        unsubscribe = subscribeMessages(convId, (newMessage) => {
          setMessages((prev) => [...prev, newMessage]);

          // Auto-scroll quando arriva un nuovo messaggio
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        });

        // Auto-scroll ai messaggi più recenti
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 300);
      } catch (err: any) {
        console.error("Init error:", err);
        setError(err.message || "Errore durante il caricamento della chat");
      } finally {
        setLoading(false);
      }
    }

    init();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Invia messaggio
  const handleSend = async () => {
    if (!inputText.trim() || !conversationId || sending) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      await sendMessage(conversationId, messageText);

      // Il messaggio apparirà tramite realtime subscription
      // Auto-scroll
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err: any) {
      console.error("Send error:", err);
      setError(err.message || "Errore durante l'invio del messaggio");
      // Ripristina il testo in caso di errore
      setInputText(messageText);
    } finally {
      setSending(false);
    }
  };

  // Paginazione: carica messaggi più vecchi
  const handleLoadMore = async () => {
    if (!conversationId || loadingMore || messages.length === 0) return;

    setLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      const olderMessages = await loadMoreMessages(
        conversationId,
        oldestMessage.created_at,
        20
      );

      if (olderMessages.length > 0) {
        setMessages((prev) => [...olderMessages, ...prev]);
      }
    } catch (err: any) {
      console.error("Load more error:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Render messaggio
  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender_id === user?.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {isMyMessage ? (
            <LinearGradient
              colors={["#1d9bf0", "#0c7abf"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBubble}
            >
              <Text style={styles.myMessageText}>{item.body}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.otherBubbleContent}>
              <Text style={styles.otherMessageText}>{item.body}</Text>
            </View>
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  // Loading iniziale
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1d9bf0" />
        <Text style={styles.loadingText}>Caricamento chat...</Text>
      </View>
    );
  }

  // Errore
  if (error && !conversationId) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#000000", "#0a0a0a", "#1a1a1a"]}
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <LinearGradient
          colors={["#1d9bf0", "#0c7abf"]}
          style={styles.headerIcon}
        >
          <Ionicons name="chatbubbles" size={24} color="#fff" />
        </LinearGradient>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Team Theoremz</Text>
          <Text style={styles.headerSubtitle}>Chat in tempo reale</Text>
        </View>
      </View>

      {/* Messaggi */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messagesList,
          { paddingBottom: 80 }, // Spazio per input floating
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#1d9bf0"
              style={styles.loadMoreIndicator}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={64} color="#71767b" />
            <Text style={styles.emptyText}>Nessun messaggio ancora</Text>
            <Text style={styles.emptySubtext}>
              Inizia la conversazione con il team!
            </Text>
          </View>
        }
      />

      {/* Input Floating */}
      <View style={styles.inputFloatingContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Scrivi un messaggio..."
            placeholderTextColor="#71767b"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            editable={!sending}
          />
          <Pressable
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Errore temporaneo */}
      {error && conversationId && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <Pressable onPress={() => setError(null)}>
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    gap: 16,
    padding: 24,
  },
  loadingText: {
    color: "#e7e9ea",
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(29, 155, 240, 0.2)",
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#71767b",
    marginTop: 2,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    overflow: "hidden",
  },
  myMessageBubble: {
    // Gradient gestito da LinearGradient
  },
  otherMessageBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  gradientBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  otherBubbleContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  myMessageText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },
  otherMessageText: {
    color: "#e7e9ea",
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: "#71767b",
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputFloatingContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(29, 155, 240, 0.2)",
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(29, 155, 240, 0.2)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1d9bf0",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#71767b",
    opacity: 0.5,
  },
  loadMoreIndicator: {
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    gap: 8,
  },
  emptyText: {
    color: "#e7e9ea",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#71767b",
    fontSize: 14,
  },
  errorBanner: {
    position: "absolute",
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorBannerText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
});
