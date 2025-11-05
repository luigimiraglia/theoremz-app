import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  fetchMessages,
  Message,
  sendMessage,
  subscribeMessages,
} from "../lib/chatApi";
import { bootstrapStudentChat } from "../lib/chatBootstrap";
import { useAuth } from "../src/auth";
import { MathEditor } from "../src/MathEditor";
import { MathView } from "../src/MathView";

export default function StudentChat() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // State Supabase
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State UI
  const [chatMode, setChatMode] = useState<"teacher" | "ai">("teacher");
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMathEditor, setShowMathEditor] = useState(false);
  const [currentFormula, setCurrentFormula] = useState<string | null>(null);

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

        // 2. Carica solo ultimi 30 messaggi per performance
        const initialMessages = await fetchMessages(convId, 30);
        setMessages(initialMessages);

        // 3. Subscribe ai nuovi messaggi in tempo reale
        // SOLO messaggi da altri utenti (non i nostri)
        unsubscribe = subscribeMessages(convId, (newMessage) => {
          console.log("📨 Realtime message received in component:", newMessage);
          setMessages((prev) => {
            // Evita duplicati: controlla se il messaggio esiste già
            const exists = prev.some((msg) => msg.id === newMessage.id);
            if (exists) {
              console.log("⚠️ Message already exists, skipping");
              return prev; // Non modificare lo state se esiste già
            }

            console.log("✅ Adding new message to state");
            // Aggiungi solo se è un messaggio nuovo
            return [...prev, newMessage];
          });
        });

        // Auto-scroll ai messaggi più recenti
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
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
    if (
      (!inputText.trim() && !selectedImage && !currentFormula) ||
      !conversationId ||
      sending
    )
      return;

    // Combina formula e testo
    let finalText = "";
    if (currentFormula) {
      finalText = currentFormula;
      if (inputText.trim()) {
        finalText += " " + inputText.trim();
      }
    } else {
      finalText = inputText.trim();
    }

    setInputText("");
    setSelectedImage(null);
    setCurrentFormula(null);
    setSending(true);

    try {
      await sendMessage(conversationId, finalText);

      // Il messaggio apparirà automaticamente via realtime
      // Auto-scroll
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } catch (err: any) {
      console.error("Send error:", err);
      setError(err.message || "Errore durante l'invio del messaggio");
      // Ripristina il testo in caso di errore
      setInputText(finalText);
    } finally {
      setSending(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
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

  // Rileva se un messaggio contiene formule matematiche
  const hasMath = (text: string) => /\$|\\\[|\\\(|\\begin\{/.test(text);

  return (
    <View style={styles.chatContainer}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#1a1a1a"]}
        style={styles.gradient}
      >
        {/* Chat Selector Dropdown */}
        <View style={[styles.chatHeader, { paddingTop: insets.top + 10 }]}>
          <Pressable
            style={styles.chatSelector}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <View style={styles.chatSelectorLeft}>
              <LinearGradient
                colors={
                  chatMode === "ai"
                    ? ["#1d9bf0", "#0c7abf"]
                    : ["#8b5cf6", "#6d28d9"]
                }
                style={styles.chatSelectorIcon}
              >
                <Ionicons
                  name={chatMode === "ai" ? "sparkles" : "school"}
                  size={20}
                  color="#fff"
                />
              </LinearGradient>
              <View>
                <Text style={styles.chatSelectorTitle}>
                  {chatMode === "ai" ? "Assistente AI" : "Team Theoremz"}
                </Text>
                <Text style={styles.chatSelectorSubtitle}>
                  {chatMode === "ai"
                    ? "Risposte immediate 24/7"
                    : "Il tuo team di supporto"}
                </Text>
              </View>
            </View>
            <Ionicons
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={24}
              color="#71767b"
            />
          </Pressable>

          {/* Dropdown Menu */}
          {showDropdown && (
            <View style={styles.dropdownMenu}>
              <BlurView intensity={80} tint="dark" style={styles.dropdownBlur}>
                <Pressable
                  style={[
                    styles.dropdownItem,
                    chatMode === "ai" && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setChatMode("ai");
                    setShowDropdown(false);
                  }}
                >
                  <LinearGradient
                    colors={["#1d9bf0", "#0c7abf"]}
                    style={styles.dropdownIcon}
                  >
                    <Ionicons name="sparkles" size={18} color="#fff" />
                  </LinearGradient>
                  <View style={styles.dropdownItemText}>
                    <Text style={styles.dropdownItemTitle}>Assistente AI</Text>
                    <Text style={styles.dropdownItemSubtitle}>
                      Risposte immediate 24/7
                    </Text>
                  </View>
                  {chatMode === "ai" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#1d9bf0"
                    />
                  )}
                </Pressable>

                <View style={styles.dropdownDivider} />

                <Pressable
                  style={[
                    styles.dropdownItem,
                    chatMode === "teacher" && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setChatMode("teacher");
                    setShowDropdown(false);
                  }}
                >
                  <LinearGradient
                    colors={["#8b5cf6", "#6d28d9"]}
                    style={styles.dropdownIcon}
                  >
                    <Ionicons name="school" size={18} color="#fff" />
                  </LinearGradient>
                  <View style={styles.dropdownItemText}>
                    <Text style={styles.dropdownItemTitle}>Team Theoremz</Text>
                    <Text style={styles.dropdownItemSubtitle}>
                      Il tuo team di supporto
                    </Text>
                  </View>
                  {chatMode === "teacher" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#8b5cf6"
                    />
                  )}
                </Pressable>
              </BlurView>
            </View>
          )}
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((item) => {
            const isMyMessage = item.sender_id === user?.uid;
            return (
              <View
                key={item.id}
                style={[
                  styles.messageContainer,
                  isMyMessage
                    ? styles.userMessageContainer
                    : styles.botMessageContainer,
                ]}
              >
                {!isMyMessage && (
                  <View style={styles.avatarContainer}>
                    <LinearGradient
                      colors={["#8b5cf6", "#6d28d9"]}
                      style={styles.avatar}
                    >
                      <Ionicons name="school" size={18} color="#fff" />
                    </LinearGradient>
                  </View>
                )}
                <View style={{ maxWidth: "75%" }}>
                  <View
                    style={[
                      styles.messageBubble,
                      isMyMessage ? styles.userMessage : styles.botMessage,
                    ]}
                  >
                    <View style={styles.messageTextContainer}>
                      {hasMath(item.body) ? (
                        <>
                          <MathView math={item.body} />
                          <Text
                            style={[
                              styles.messageText,
                              { fontSize: 11, opacity: 0.5, marginTop: 8 },
                            ]}
                          >
                            {item.body}
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={[
                            styles.messageText,
                            isMyMessage
                              ? styles.userMessageText
                              : styles.botMessageText,
                          ]}
                        >
                          {item.body}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                {isMyMessage && (
                  <View style={styles.avatarContainer}>
                    <View style={styles.userAvatar}>
                      <Ionicons name="person" size={18} color="#1d9bf0" />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View
            style={[
              styles.inputWrapper,
              {
                paddingBottom: Math.max(insets.bottom, 10),
                marginBottom: 80, // Spazio per le tab
              },
            ]}
          >
            <BlurView intensity={80} tint="dark" style={styles.inputBlur}>
              {selectedImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={removeImage}
                    style={styles.removeImageButton}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.inputContainer}>
                <Pressable style={styles.attachButton} onPress={pickImage}>
                  <Ionicons name="image-outline" size={22} color="#1d9bf0" />
                </Pressable>
                <Pressable
                  style={[styles.attachButton, styles.mathButton]}
                  onPress={() => setShowMathEditor(true)}
                >
                  <Text style={styles.mathButtonText}>𝑓(x)</Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  {/* Anteprima formula se presente */}
                  {currentFormula && (
                    <View style={styles.mathPreviewInInput}>
                      <View style={{ flex: 1, minHeight: 40 }}>
                        <MathView math={currentFormula} />
                      </View>
                      <Pressable
                        style={styles.removeMathButton}
                        onPress={() => setCurrentFormula(null)}
                      >
                        <Text style={styles.removeMathText}>✕</Text>
                      </Pressable>
                    </View>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder={
                      selectedImage
                        ? "Aggiungi un messaggio (opzionale)..."
                        : "Ask me anything..."
                    }
                    placeholderTextColor="#71767b"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxLength={500}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                  />
                </View>
                <Pressable
                  style={[
                    styles.sendButtonCircle,
                    !inputText.trim() &&
                      !selectedImage &&
                      !currentFormula &&
                      styles.sendButtonDisabled,
                  ]}
                  onPress={handleSend}
                  disabled={
                    !inputText.trim() && !selectedImage && !currentFormula
                  }
                >
                  <Ionicons name="arrow-up" size={20} color="#fff" />
                </Pressable>
              </View>
            </BlurView>
          </View>
        </KeyboardAvoidingView>

        {/* Editor Formule Matematiche */}
        <MathEditor
          visible={showMathEditor}
          onClose={() => setShowMathEditor(false)}
          onInsert={(latex) => {
            setCurrentFormula(latex);
          }}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  gradient: {
    flex: 1,
    width: "100%",
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
  chatHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(29, 155, 240, 0.2)",
  },
  chatSelector: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 4,
  },
  chatSelectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  chatSelectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chatSelectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  chatSelectorSubtitle: {
    fontSize: 12,
    color: "#71767b",
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  dropdownBlur: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  dropdownItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  dropdownIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownItemText: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  dropdownItemSubtitle: {
    fontSize: 12,
    color: "#71767b",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginHorizontal: 8,
    marginBottom: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(29, 155, 240, 0.15)",
    borderWidth: 2,
    borderColor: "rgba(29, 155, 240, 0.5)",
  },
  messageBubble: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  messageTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(29, 155, 240, 0.2)",
    borderColor: "rgba(29, 155, 240, 0.3)",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#e7e9ea",
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  inputBlur: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 14,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  attachButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(29, 155, 240, 0.1)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(29, 155, 240, 0.2)",
    marginRight: 8,
  },
  mathButton: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  mathButtonText: {
    fontSize: 18,
    color: "#8b5cf6",
    fontWeight: "700",
  },
  mathPreviewInInput: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  removeMathButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  removeMathText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  imagePreview: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
  },
  removeImageButton: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  sendButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d9bf0",
  },
  sendButtonDisabled: {
    backgroundColor: "#333",
    opacity: 0.4,
  },
});
