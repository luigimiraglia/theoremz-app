import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../src/auth";
import { MathEditor } from "../../src/MathEditor";
import { MathView } from "../../src/MathView";
import { SwipeableTabContainer } from "../../src/SwipeableTabContainer";
import { Toast } from "../../src/Toast";

function HomePage() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<1 | 2>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [remainingLessons, setRemainingLessons] = useState(8);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "success" });

  // Genera i prossimi 7 giorni
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  // Orari disponibili
  const availableSlots = ["09:00", "10:30", "14:00", "15:30", "17:00", "18:30"];

  const formatDate = (date: Date) => {
    const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    const months = [
      "Gen",
      "Feb",
      "Mar",
      "Apr",
      "Mag",
      "Giu",
      "Lug",
      "Ago",
      "Set",
      "Ott",
      "Nov",
      "Dic",
    ];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date.toISOString().split("T")[0],
    };
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime && remainingLessons > 0) {
      setRemainingLessons(remainingLessons - 1);
      setShowBookingModal(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setToast({
        visible: true,
        message: `Lezione prenotata per il ${selectedDate} alle ${selectedTime} (${selectedDuration}h)`,
        type: "success",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#1a1a1a"]}
        style={styles.gradient}
      >
        <ScrollView
          style={[styles.container, { paddingTop: insets.top + 20 }]}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Il Tuo Professore</Text>

          {/* Info Professore */}
          <View style={styles.teacherCard}>
            <View style={styles.teacherHeader}>
              <LinearGradient
                colors={["#8b5cf6", "#6d28d9"]}
                style={styles.teacherAvatar}
              >
                <Ionicons name="person" size={28} color="#fff" />
              </LinearGradient>
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>Prof. Marco Rossi</Text>
                <Text style={styles.teacherSubject}>Matematica & Fisica</Text>
                <View style={styles.teacherRating}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Ionicons name="star-half" size={14} color="#f59e0b" />
                  <Text style={styles.ratingText}>4.8 (127 recensioni)</Text>
                </View>
              </View>
            </View>
            <Text style={styles.teacherBio}>
              Docente universitario con 15 anni di esperienza
              nell&apos;insegnamento di matematica e fisica. Specializzato in
              analisi, algebra lineare e meccanica quantistica.
            </Text>
          </View>

          {/* Lezioni Rimanenti */}
          <View style={styles.lessonsCard}>
            <View style={styles.lessonsHeader}>
              <Ionicons name="book" size={24} color="#1d9bf0" />
              <Text style={styles.lessonsTitle}>Lezioni Disponibili</Text>
            </View>
            <Text style={styles.lessonsCount}>{remainingLessons}</Text>
            <Text style={styles.lessonsSubtitle}>
              lezioni rimanenti da prenotare
            </Text>
          </View>

          {/* Pulsante Prenota */}
          <Pressable
            style={styles.bookButton}
            onPress={() => setShowBookingModal(true)}
          >
            <LinearGradient
              colors={["#1d9bf0", "#0c7abf"]}
              style={styles.bookButtonGradient}
            >
              <Ionicons name="calendar-outline" size={24} color="#fff" />
              <Text style={styles.bookButtonText}>Prenota una Lezione</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </LinearGradient>

      {/* Modal Prenotazione */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowBookingModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <BlurView intensity={95} tint="dark" style={styles.modalBlur}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Prenota una Lezione</Text>
                <Pressable onPress={() => setShowBookingModal(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Selezione Durata */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Durata</Text>
                  <View style={styles.durationContainer}>
                    <Pressable
                      style={[
                        styles.durationButton,
                        selectedDuration === 1 && styles.durationButtonActive,
                      ]}
                      onPress={() => setSelectedDuration(1)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={24}
                        color={selectedDuration === 1 ? "#fff" : "#71767b"}
                      />
                      <Text
                        style={[
                          styles.durationText,
                          selectedDuration === 1 && styles.durationTextActive,
                        ]}
                      >
                        1 ora
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.durationButton,
                        selectedDuration === 2 && styles.durationButtonActive,
                      ]}
                      onPress={() => setSelectedDuration(2)}
                    >
                      <Ionicons
                        name="timer-outline"
                        size={24}
                        color={selectedDuration === 2 ? "#fff" : "#71767b"}
                      />
                      <Text
                        style={[
                          styles.durationText,
                          selectedDuration === 2 && styles.durationTextActive,
                        ]}
                      >
                        2 ore
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Calendario */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Data</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateScrollContainer}
                  >
                    {dates.map((date, index) => {
                      const formatted = formatDate(date);
                      const isSelected = selectedDate === formatted.fullDate;
                      const isToday = index === 0;

                      return (
                        <Pressable
                          key={index}
                          style={[
                            styles.dateCard,
                            isSelected && styles.dateCardActive,
                          ]}
                          onPress={() => setSelectedDate(formatted.fullDate)}
                        >
                          <Text
                            style={[
                              styles.dateDay,
                              isSelected && styles.dateDayActive,
                            ]}
                          >
                            {formatted.day}
                          </Text>
                          <Text
                            style={[
                              styles.dateNumber,
                              isSelected && styles.dateNumberActive,
                            ]}
                          >
                            {formatted.date}
                          </Text>
                          <Text
                            style={[
                              styles.dateMonth,
                              isSelected && styles.dateMonthActive,
                            ]}
                          >
                            {formatted.month}
                          </Text>
                          {isToday && !isSelected && (
                            <View style={styles.todayDot} />
                          )}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Orari */}
                {selectedDate && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Orario</Text>
                    <View style={styles.timeGrid}>
                      {availableSlots.map((time, index) => {
                        const isSelected = selectedTime === time;
                        return (
                          <Pressable
                            key={index}
                            style={[
                              styles.timeSlot,
                              isSelected && styles.timeSlotActive,
                            ]}
                            onPress={() => setSelectedTime(time)}
                          >
                            <Ionicons
                              name="alarm-outline"
                              size={20}
                              color={isSelected ? "#fff" : "#1d9bf0"}
                            />
                            <Text
                              style={[
                                styles.timeText,
                                isSelected && styles.timeTextActive,
                              ]}
                            >
                              {time}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Conferma */}
                {selectedDate && selectedTime && (
                  <Pressable
                    style={styles.modalConfirmButton}
                    onPress={handleBooking}
                  >
                    <LinearGradient
                      colors={["#1d9bf0", "#0c7abf"]}
                      style={styles.modalConfirmGradient}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#fff"
                      />
                      <Text style={styles.modalConfirmText}>
                        Conferma Prenotazione
                      </Text>
                    </LinearGradient>
                  </Pressable>
                )}
              </ScrollView>
            </BlurView>
          </Pressable>
        </Pressable>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
}

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  hasMath?: boolean;
};

function ChatPage() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [chatMode, setChatMode] = useState<"teacher" | "ai">("ai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Ciao! Come posso aiutarti?",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Ciao! Vorrei sapere come funziona questa chat",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: "3",
      text: "Questa chat ti permette di fare domande e ricevere risposte. Puoi scrollare per vedere i messaggi precedenti!",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: "4",
      text: "Perfetto! E posso inviare immagini e formule matematiche?",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: "5",
      text: "Sì! Usa il bottone 📷 per le immagini e il bottone ∑ per le formule matematiche. Esempio: $E = mc^2$ oppure $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$",
      isUser: false,
      timestamp: new Date(),
      hasMath: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMathEditor, setShowMathEditor] = useState(false);
  const [currentFormula, setCurrentFormula] = useState<string | null>(null);

  const handleSend = () => {
    if (!inputText.trim() && !selectedImage && !currentFormula) return;

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

    // Rileva se il messaggio contiene formule matematiche
    const hasMath = /\$|\\\[|\\\(|\\begin\{/.test(finalText);

    const newMessage: Message = {
      id: Date.now().toString(),
      text: finalText,
      isUser: true,
      timestamp: new Date(),
      image: selectedImage || undefined,
      hasMath,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setSelectedImage(null);
    setCurrentFormula(null);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: selectedImage
          ? "Bella immagine! Ho ricevuto la tua foto."
          : "Questa è una risposta simulata. Il backend sarà implementato in seguito!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
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
                  {chatMode === "ai" ? "Assistente AI" : "Prof. Rossi"}
                </Text>
                <Text style={styles.chatSelectorSubtitle}>
                  {chatMode === "ai"
                    ? "Risposte immediate 24/7"
                    : "Il tuo insegnante personale"}
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
                    <Text style={styles.dropdownItemTitle}>Prof. Rossi</Text>
                    <Text style={styles.dropdownItemSubtitle}>
                      Il tuo insegnante personale
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
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={true}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((item) => (
            <View
              key={item.id}
              style={[
                styles.messageContainer,
                item.isUser
                  ? styles.userMessageContainer
                  : styles.botMessageContainer,
              ]}
            >
              {!item.isUser && (
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={["#1d9bf0", "#0c7abf"]}
                    style={styles.avatar}
                  >
                    <Ionicons name="sparkles" size={18} color="#fff" />
                  </LinearGradient>
                </View>
              )}
              <View style={{ maxWidth: "75%" }}>
                <View
                  style={[
                    styles.messageBubble,
                    item.isUser ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.messageImage}
                      resizeMode="cover"
                    />
                  )}
                  {item.text && (
                    <View style={styles.messageTextContainer}>
                      {item.hasMath ? (
                        <>
                          <MathView math={item.text} />
                          <Text
                            style={[
                              styles.messageText,
                              { fontSize: 11, opacity: 0.5, marginTop: 8 },
                            ]}
                          >
                            {item.text}
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={[
                            styles.messageText,
                            item.isUser
                              ? styles.userMessageText
                              : styles.botMessageText,
                          ]}
                        >
                          {item.text}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
              {item.isUser && (
                <View style={styles.avatarContainer}>
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={18} color="#1d9bf0" />
                  </View>
                </View>
              )}
            </View>
          ))}
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
                  {/* Input sempre visibile */}
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
                      styles.sendButtonDisabled,
                  ]}
                  onPress={handleSend}
                  disabled={!inputText.trim() && !selectedImage}
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

function AccountPage() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "success" });

  const handleLogout = async () => {
    try {
      await logout();
      setToast({
        visible: true,
        message: "Logout effettuato con successo",
        type: "success",
      });
    } catch (error) {
      console.error("Logout error:", error);
      setToast({
        visible: true,
        message: "Errore durante il logout",
        type: "error",
      });
    }
  };

  return (
    <LinearGradient
      colors={["#000000", "#0a0a0a", "#1a1a1a"]}
      style={styles.gradient}
    >
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 20 }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profilo */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatarContainer}>
            <LinearGradient
              colors={["#8b5cf6", "#6d28d9"]}
              style={styles.profileAvatar}
            >
              <Text style={styles.profileAvatarText}>LM</Text>
            </LinearGradient>
            <View style={styles.profileBadge}>
              <Ionicons name="school" size={14} color="#fff" />
            </View>
          </View>
          <Text style={styles.profileName}>Luigi Miraglia</Text>
          <Text style={styles.profileEmail}>ermattissimo@gmail.com</Text>
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Problemi risolti</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Giorni di streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8.5</Text>
              <Text style={styles.statLabel}>Media voti</Text>
            </View>
          </View>
        </View>

        {/* Sezione Corsi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I miei corsi</Text>
          <View style={styles.courseCard}>
            <View style={styles.courseIconContainer}>
              <LinearGradient
                colors={["#1d9bf0", "#0c7abf"]}
                style={styles.courseIcon}
              >
                <Ionicons name="calculator" size={24} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>Analisi Matematica I</Text>
              <Text style={styles.courseSubtitle}>Prof. Rossi • 12 CFU</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "75%" }]} />
              </View>
            </View>
          </View>

          <View style={styles.courseCard}>
            <View style={styles.courseIconContainer}>
              <LinearGradient
                colors={["#10b981", "#059669"]}
                style={styles.courseIcon}
              >
                <Ionicons name="planet" size={24} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>Fisica Generale</Text>
              <Text style={styles.courseSubtitle}>Prof. Bianchi • 9 CFU</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "60%" }]} />
              </View>
            </View>
          </View>

          <View style={styles.courseCard}>
            <View style={styles.courseIconContainer}>
              <LinearGradient
                colors={["#8b5cf6", "#6d28d9"]}
                style={styles.courseIcon}
              >
                <Ionicons name="git-branch" size={24} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>Algebra Lineare</Text>
              <Text style={styles.courseSubtitle}>Prof. Verdi • 6 CFU</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "90%" }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Sezione Obiettivi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Obiettivi settimanali</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="trophy" size={20} color="#f59e0b" />
              <Text style={styles.goalTitle}>Risolvi 10 esercizi</Text>
            </View>
            <Text style={styles.goalProgress}>7/10 completati</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "70%" }]} />
            </View>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="flame" size={20} color="#ef4444" />
              <Text style={styles.goalTitle}>Mantieni lo streak</Text>
            </View>
            <Text style={styles.goalProgress}>24 giorni consecutivi 🔥</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
          </View>
        </View>

        {/* Sezione Impostazioni */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impostazioni</Text>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={22} color="#1d9bf0" />
              <Text style={styles.settingText}>Notifiche</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#71767b" />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={22} color="#1d9bf0" />
              <Text style={styles.settingText}>Lingua</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>Italiano</Text>
              <Ionicons name="chevron-forward" size={20} color="#71767b" />
            </View>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon" size={22} color="#1d9bf0" />
              <Text style={styles.settingText}>Tema scuro</Text>
            </View>
            <View style={styles.switchContainer}>
              <View style={styles.switchOn}>
                <View style={styles.switchThumb} />
              </View>
            </View>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle" size={22} color="#1d9bf0" />
              <Text style={styles.settingText}>Aiuto e supporto</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#71767b" />
          </Pressable>

          <Pressable
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="log-out" size={22} color="#ef4444" />
              <Text style={[styles.settingText, { color: "#ef4444" }]}>
                Esci
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#71767b" />
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Theoremz v1.0.0 • Made with 💜</Text>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </LinearGradient>
  );
}

export default function AppLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SwipeableTabContainer>
        <HomePage />
        <ChatPage />
        <AccountPage />
      </SwipeableTabContainer>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#ffffff",
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  label: {
    fontSize: 12,
    color: "#71767b",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#1d9bf0",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // Chat styles
  chatContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  chatHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(29, 155, 240, 0.2)",
  },
  chatTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 14,
    color: "#71767b",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
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
    shadowColor: "#1d9bf0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  messageTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  messageGradient: {
    padding: 14,
    paddingHorizontal: 18,
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
  messageImage: {
    width: 250,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 14,
  },
  inputGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  mathPreview: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  mathInputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editMathButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: 15,
  },
  editMathText: {
    fontSize: 16,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  removeImageText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d9bf0",
    shadowColor: "#1d9bf0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#333",
    opacity: 0.4,
    shadowOpacity: 0,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  // Profile Page Styles
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  profileAvatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  profileAvatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  profileBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1d9bf0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#71767b",
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d9bf0",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#71767b",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  courseCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  courseIconContainer: {
    marginRight: 16,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 13,
    color: "#71767b",
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1d9bf0",
    borderRadius: 3,
  },
  goalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  goalProgress: {
    fontSize: 13,
    color: "#71767b",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingText: {
    fontSize: 16,
    color: "#fff",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#71767b",
  },
  switchContainer: {
    padding: 2,
  },
  switchOn: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1d9bf0",
    justifyContent: "center",
    paddingHorizontal: 2,
    alignItems: "flex-end",
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#71767b",
    marginTop: 16,
    marginBottom: 24,
  },
  // Booking Styles
  durationContainer: {
    flexDirection: "row",
    gap: 12,
  },
  durationButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  durationButtonActive: {
    backgroundColor: "rgba(29, 155, 240, 0.2)",
    borderColor: "#1d9bf0",
    shadowColor: "#1d9bf0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  durationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#71767b",
    marginTop: 8,
  },
  durationTextActive: {
    color: "#fff",
  },
  durationPrice: {
    fontSize: 14,
    color: "#71767b",
    marginTop: 4,
  },
  durationPriceActive: {
    color: "#1d9bf0",
    fontWeight: "600",
  },
  dateScrollContainer: {
    paddingVertical: 4,
    gap: 12,
  },
  dateCard: {
    width: 80,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  dateCardActive: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dateDay: {
    fontSize: 12,
    color: "#71767b",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dateDayActive: {
    color: "#8b5cf6",
    fontWeight: "600",
  },
  dateNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  dateNumberActive: {
    color: "#8b5cf6",
  },
  dateMonth: {
    fontSize: 12,
    color: "#71767b",
  },
  dateMonthActive: {
    color: "#8b5cf6",
    fontWeight: "600",
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1d9bf0",
    marginTop: 8,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    width: "47%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "rgba(29, 155, 240, 0.2)",
  },
  timeSlotActive: {
    backgroundColor: "rgba(29, 155, 240, 0.2)",
    borderColor: "#1d9bf0",
    shadowColor: "#1d9bf0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1d9bf0",
  },
  timeTextActive: {
    color: "#fff",
  },
  summaryCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#1d9bf0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryTotalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  teacherCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  teacherHeader: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  teacherAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  teacherSubject: {
    fontSize: 14,
    color: "#71767b",
    marginBottom: 8,
  },
  teacherRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#71767b",
    marginLeft: 6,
  },
  teacherBio: {
    fontSize: 14,
    color: "#e7e9ea",
    lineHeight: 20,
  },
  // Lessons Card
  lessonsCard: {
    backgroundColor: "rgba(29, 155, 240, 0.1)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(29, 155, 240, 0.3)",
    alignItems: "center",
  },
  lessonsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  lessonsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1d9bf0",
  },
  lessonsCount: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#1d9bf0",
    marginBottom: 8,
  },
  lessonsSubtitle: {
    fontSize: 14,
    color: "#71767b",
    textAlign: "center",
  },
  // Book Button
  bookButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1d9bf0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  bookButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  modalBlur: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  modalConfirmButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1d9bf0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  modalConfirmGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 12,
  },
  modalConfirmText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  // Chat Selector Dropdown
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
});
