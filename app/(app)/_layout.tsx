import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
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
import StudentChat from "../../screens/StudentChat";

function HomePage() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "success" });

  // Dati statistiche utente
  const userStats = {
    problemsSolved: 156,
    currentStreak: 12,
    totalPoints: 2840,
    rank: "Gold",
    weeklyGoal: 20,
    weeklyCompleted: 14,
  };

  // Categorie di esercizi
  const categories = [
    {
      id: "algebra",
      name: "Algebra",
      icon: "calculator" as const,
      color: "#2b7fff",
      progress: 75,
      exercises: 48,
    },
    {
      id: "geometria",
      name: "Geometria",
      icon: "triangle" as const,
      color: "#10b981",
      progress: 60,
      exercises: 36,
    },
    {
      id: "analisi",
      name: "Analisi",
      icon: "analytics" as const,
      color: "#f59e0b",
      progress: 45,
      exercises: 52,
    },
    {
      id: "statistica",
      name: "Statistica",
      icon: "bar-chart" as const,
      color: "#8b5cf6",
      progress: 30,
      exercises: 28,
    },
  ];

  // Esercizi giornalieri
  const dailyChallenges = [
    {
      id: "1",
      title: "Derivata di una funzione composta",
      difficulty: "Medio",
      points: 50,
      timeEstimate: "10 min",
    },
    {
      id: "2",
      title: "Risolvi sistema lineare 3x3",
      difficulty: "Facile",
      points: 30,
      timeEstimate: "5 min",
    },
    {
      id: "3",
      title: "Teorema di Pitagora - Applicazione",
      difficulty: "Difficile",
      points: 80,
      timeEstimate: "15 min",
    },
  ];

  // Leaderboard
  const leaderboard = [
    { rank: 1, name: "Anna Rossi", points: 3250, avatar: "🏆" },
    { rank: 2, name: "Marco Bianchi", points: 3100, avatar: "🥈" },
    { rank: 3, name: "Luigi Miraglia", points: 2840, avatar: "🥉", isMe: true },
    { rank: 4, name: "Sara Verdi", points: 2720, avatar: "👤" },
    { rank: 5, name: "Paolo Neri", points: 2580, avatar: "👤" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "#10b981";
      case "Medio":
        return "#f59e0b";
      case "Difficile":
        return "#ef4444";
      default:
        return "#71767b";
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#0a0e1a", "#0d1117", "#0a0e1a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Pattern decorativo di brand */}
        <View style={styles.brandPattern}>
          <View style={[styles.brandPatternDot, { top: "10%", left: "5%" }]} />
          <View style={[styles.brandPatternDot, { top: "25%", right: "8%" }]} />
          <View style={[styles.brandPatternDot, { top: "45%", left: "12%" }]} />
          <View style={[styles.brandPatternDot, { top: "65%", right: "6%" }]} />
          <View style={[styles.brandPatternDot, { top: "85%", left: "7%" }]} />
        </View>

        <ScrollView
          style={[styles.container, { paddingTop: insets.top + 20 }]}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con saluto */}
          <View style={styles.homeHeader}>
            <View>
              <View style={styles.brandHeader}>
                <Text style={styles.brandName}>theoremz</Text>
                <View style={styles.brandDot} />
              </View>
              <Text style={styles.greetingText}>Ciao, Luigi! 👋</Text>
              <Text style={styles.greetingSubtext}>
                Pronto per le sfide di oggi?
              </Text>
            </View>
            <Pressable style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </Pressable>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(43, 127, 255, 0.2)", "rgba(43, 127, 255, 0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCardGradient}
              >
                <View style={styles.statIconContainer}>
                  <Ionicons name="trophy" size={28} color="#2b7fff" />
                  <View style={styles.statIconGlow} />
                </View>
                <Text style={styles.statValue}>{userStats.problemsSolved}</Text>
                <Text style={styles.statLabel}>Problemi</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCardGradient}
              >
                <View style={styles.statIconContainer}>
                  <Ionicons name="flame" size={28} color="#10b981" />
                  <View
                    style={[
                      styles.statIconGlow,
                      { backgroundColor: "rgba(16, 185, 129, 0.3)" },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{userStats.currentStreak}</Text>
                <Text style={styles.statLabel}>Giorni</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCardGradient}
              >
                <View style={styles.statIconContainer}>
                  <Ionicons name="star" size={28} color="#f59e0b" />
                  <View
                    style={[
                      styles.statIconGlow,
                      { backgroundColor: "rgba(245, 158, 11, 0.3)" },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{userStats.totalPoints}</Text>
                <Text style={styles.statLabel}>Punti</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Progresso settimanale */}
          <View style={styles.weeklyGoalCard}>
            <View style={styles.weeklyGoalHeader}>
              <Text style={styles.weeklyGoalTitle}>Obiettivo Settimanale</Text>
              <Text style={styles.weeklyGoalProgress}>
                {userStats.weeklyCompleted}/{userStats.weeklyGoal}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={["#2b7fff", "#1e6edb"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(userStats.weeklyCompleted / userStats.weeklyGoal) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.weeklyGoalSubtext}>
              Ancora {userStats.weeklyGoal - userStats.weeklyCompleted} esercizi
              per completare l&apos;obiettivo!
            </Text>
          </View>

          {/* Sfide giornaliere */}
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>Sfide di Oggi</Text>
              <View style={styles.brandDot} />
            </View>
            <Pressable>
              <Text style={styles.seeAllText}>Vedi tutte →</Text>
            </Pressable>
          </View>

          {dailyChallenges.map((challenge) => (
            <Pressable
              key={challenge.id}
              style={styles.challengeCard}
              onPress={() =>
                setToast({
                  visible: true,
                  message: `Iniziando: ${challenge.title}`,
                  type: "info",
                })
              }
            >
              <View style={styles.challengeContent}>
                <View style={styles.challengeLeft}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <View style={styles.challengeMeta}>
                    <View
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          { color: getDifficultyColor(challenge.difficulty) },
                        ]}
                      >
                        {challenge.difficulty}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="#71767b" />
                      <Text style={styles.metaText}>
                        {challenge.timeEstimate}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={14} color="#f59e0b" />
                      <Text style={styles.metaText}>{challenge.points} pt</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#71767b" />
              </View>
            </Pressable>
          ))}

          {/* Categorie */}
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>Esplora Argomenti</Text>
              <View style={styles.brandDot} />
            </View>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={styles.categoryCard}
                onPress={() => setSelectedTopic(category.id)}
              >
                <LinearGradient
                  colors={[`${category.color}20`, `${category.color}10`]}
                  style={styles.categoryGradient}
                >
                  <Ionicons
                    name={category.icon}
                    size={32}
                    color={category.color}
                  />
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryExercises}>
                    {category.exercises} esercizi
                  </Text>
                  <View style={styles.categoryProgressBar}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        {
                          width: `${category.progress}%`,
                          backgroundColor: category.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryProgressText}>
                    {category.progress}% completato
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>

          {/* Leaderboard */}
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>Classifica</Text>
              <View style={styles.brandDot} />
            </View>
            <Pressable>
              <Text style={styles.seeAllText}>Globale →</Text>
            </Pressable>
          </View>

          <View style={styles.leaderboardCard}>
            {leaderboard.map((player) => (
              <View
                key={player.rank}
                style={[
                  styles.leaderboardItem,
                  player.isMe && styles.leaderboardItemMe,
                ]}
              >
                <View style={styles.leaderboardLeft}>
                  <Text style={styles.leaderboardRank}>#{player.rank}</Text>
                  <Text style={styles.leaderboardAvatar}>{player.avatar}</Text>
                  <Text
                    style={[
                      styles.leaderboardName,
                      player.isMe && styles.leaderboardNameMe,
                    ]}
                  >
                    {player.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.leaderboardPoints,
                    player.isMe && styles.leaderboardPointsMe,
                  ]}
                >
                  {player.points.toLocaleString()} pt
                </Text>
              </View>
            ))}
          </View>

          {/* Performance Stats */}
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>Le Tue Performance</Text>
              <View style={styles.brandDot} />
            </View>
          </View>

          <View style={styles.performanceGrid}>
            <View style={styles.performanceCard}>
              <View style={styles.performanceIconContainer}>
                <LinearGradient
                  colors={["rgba(34, 197, 94, 0.2)", "rgba(34, 197, 94, 0.05)"]}
                  style={styles.performanceIcon}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                </LinearGradient>
              </View>
              <Text style={styles.performanceValue}>92%</Text>
              <Text style={styles.performanceLabel}>Accuratezza</Text>
            </View>

            <View style={styles.performanceCard}>
              <View style={styles.performanceIconContainer}>
                <LinearGradient
                  colors={[
                    "rgba(245, 158, 11, 0.2)",
                    "rgba(245, 158, 11, 0.05)",
                  ]}
                  style={styles.performanceIcon}
                >
                  <Ionicons name="school" size={24} color="#f59e0b" />
                </LinearGradient>
              </View>
              <Text style={styles.performanceValue}>8.7</Text>
              <Text style={styles.performanceLabel}>Media Voti</Text>
            </View>

            <View style={styles.performanceCard}>
              <View style={styles.performanceIconContainer}>
                <LinearGradient
                  colors={[
                    "rgba(139, 92, 246, 0.2)",
                    "rgba(139, 92, 246, 0.05)",
                  ]}
                  style={styles.performanceIcon}
                >
                  <Ionicons name="trending-up" size={24} color="#8b5cf6" />
                </LinearGradient>
              </View>
              <Text style={styles.performanceValue}>+12%</Text>
              <Text style={styles.performanceLabel}>Miglioramento</Text>
            </View>

            <View style={styles.performanceCard}>
              <View style={styles.performanceIconContainer}>
                <LinearGradient
                  colors={["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.05)"]}
                  style={styles.performanceIcon}
                >
                  <Ionicons name="time" size={24} color="#ef4444" />
                </LinearGradient>
              </View>
              <Text style={styles.performanceValue}>12m</Text>
              <Text style={styles.performanceLabel}>Tempo Medio</Text>
            </View>
          </View>

          {/* Calendario Attività */}
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>
                Attività degli ultimi mesi
              </Text>
              <View style={styles.brandDot} />
            </View>
          </View>

          <View style={styles.activityCalendar}>
            <Text style={styles.activitySubtext}>
              156 esercizi risolti negli ultimi 12 mesi
            </Text>
            <View style={styles.calendarGrid}>
              {[...Array(12)].map((_, weekIndex) => (
                <View key={weekIndex} style={styles.calendarWeek}>
                  {[...Array(7)].map((_, dayIndex) => {
                    const activity = Math.random();
                    let bgColor = "rgba(255, 255, 255, 0.05)";
                    if (activity > 0.7) bgColor = "#2b7fff";
                    else if (activity > 0.5)
                      bgColor = "rgba(43, 127, 255, 0.7)";
                    else if (activity > 0.3)
                      bgColor = "rgba(43, 127, 255, 0.4)";
                    else if (activity > 0.1)
                      bgColor = "rgba(43, 127, 255, 0.2)";

                    return (
                      <View
                        key={dayIndex}
                        style={[
                          styles.calendarDay,
                          { backgroundColor: bgColor },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
            <View style={styles.calendarLegend}>
              <Text style={styles.legendText}>Meno</Text>
              <View style={styles.legendDots}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                  ]}
                />
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: "rgba(43, 127, 255, 0.2)" },
                  ]}
                />
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: "rgba(43, 127, 255, 0.5)" },
                  ]}
                />
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: "rgba(43, 127, 255, 0.8)" },
                  ]}
                />
                <View
                  style={[styles.legendDot, { backgroundColor: "#2b7fff" }]}
                />
              </View>
              <Text style={styles.legendText}>Più</Text>
            </View>
          </View>

          {/* Lezioni con il Professore */}
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>Lezioni Programmate</Text>
              <View style={styles.brandDot} />
            </View>
            <Pressable
              onPress={() =>
                setToast({
                  visible: true,
                  message: "Prenota nuova lezione",
                  type: "info",
                })
              }
            >
              <Text style={styles.seeAllText}>Prenota →</Text>
            </Pressable>
          </View>

          <View style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <LinearGradient
                colors={["#2b7fff", "#1e6edb"]}
                style={styles.lessonAvatar}
              >
                <Ionicons name="person" size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonProfName}>Prof. Marco Rossi</Text>
                <Text style={styles.lessonSubject}>Analisi Matematica</Text>
              </View>
              <View style={styles.lessonBadge}>
                <Text style={styles.lessonBadgeText}>Prossima</Text>
              </View>
            </View>
            <View style={styles.lessonDetails}>
              <View style={styles.lessonDetailItem}>
                <Ionicons name="calendar" size={16} color="#71767b" />
                <Text style={styles.lessonDetailText}>Giovedì, 7 Nov</Text>
              </View>
              <View style={styles.lessonDetailItem}>
                <Ionicons name="time" size={16} color="#71767b" />
                <Text style={styles.lessonDetailText}>15:30 - 17:00</Text>
              </View>
              <View style={styles.lessonDetailItem}>
                <Ionicons name="videocam" size={16} color="#71767b" />
                <Text style={styles.lessonDetailText}>Online</Text>
              </View>
            </View>
            <View style={styles.lessonTopics}>
              <View style={styles.topicTag}>
                <Text style={styles.topicTagText}>Derivate</Text>
              </View>
              <View style={styles.topicTag}>
                <Text style={styles.topicTagText}>Integrali</Text>
              </View>
            </View>
          </View>

          <View style={styles.lessonCardPast}>
            <View style={styles.lessonHeader}>
              <LinearGradient
                colors={["rgba(100, 116, 139, 0.3)", "rgba(71, 85, 105, 0.3)"]}
                style={styles.lessonAvatar}
              >
                <Ionicons name="person" size={24} color="#94a3b8" />
              </LinearGradient>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonProfNamePast}>Prof. Marco Rossi</Text>
                <Text style={styles.lessonSubjectPast}>Algebra Lineare</Text>
              </View>
              <View style={styles.lessonBadgePast}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.lessonBadgeTextPast}>Completata</Text>
              </View>
            </View>
            <View style={styles.lessonDetails}>
              <View style={styles.lessonDetailItem}>
                <Ionicons name="calendar" size={16} color="#71767b" />
                <Text style={styles.lessonDetailTextPast}>Lun, 4 Nov</Text>
              </View>
              <View style={styles.lessonDetailItem}>
                <Ionicons name="time" size={16} color="#71767b" />
                <Text style={styles.lessonDetailTextPast}>14:00 - 15:30</Text>
              </View>
            </View>
          </View>

          {/* Materiale Didattico */}
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>Materiale Recente</Text>
              <View style={styles.brandDot} />
            </View>
            <Pressable>
              <Text style={styles.seeAllText}>Tutti →</Text>
            </Pressable>
          </View>

          <View style={styles.materialCard}>
            <LinearGradient
              colors={["rgba(239, 68, 68, 0.15)", "rgba(239, 68, 68, 0.05)"]}
              style={styles.materialIcon}
            >
              <Ionicons name="document-text" size={24} color="#ef4444" />
            </LinearGradient>
            <View style={styles.materialInfo}>
              <Text style={styles.materialTitle}>
                Appunti: Derivate Complesse
              </Text>
              <View style={styles.materialMeta}>
                <Text style={styles.materialAuthor}>Prof. M. Rossi</Text>
                <Text style={styles.materialDot}>•</Text>
                <Text style={styles.materialDate}>2 giorni fa</Text>
              </View>
            </View>
            <Pressable style={styles.materialDownload}>
              <Ionicons name="download-outline" size={20} color="#2b7fff" />
            </Pressable>
          </View>

          <View style={styles.materialCard}>
            <LinearGradient
              colors={["rgba(34, 197, 94, 0.15)", "rgba(34, 197, 94, 0.05)"]}
              style={styles.materialIcon}
            >
              <Ionicons name="folder" size={24} color="#22c55e" />
            </LinearGradient>
            <View style={styles.materialInfo}>
              <Text style={styles.materialTitle}>
                Esercizi: Matrici e Vettori
              </Text>
              <View style={styles.materialMeta}>
                <Text style={styles.materialAuthor}>Prof. M. Rossi</Text>
                <Text style={styles.materialDot}>•</Text>
                <Text style={styles.materialDate}>5 giorni fa</Text>
              </View>
            </View>
            <Pressable style={styles.materialDownload}>
              <Ionicons name="download-outline" size={20} color="#2b7fff" />
            </Pressable>
          </View>

          <View style={styles.materialCard}>
            <LinearGradient
              colors={["rgba(245, 158, 11, 0.15)", "rgba(245, 158, 11, 0.05)"]}
              style={styles.materialIcon}
            >
              <Ionicons name="play-circle" size={24} color="#f59e0b" />
            </LinearGradient>
            <View style={styles.materialInfo}>
              <Text style={styles.materialTitle}>
                Video: Spiegazione Integrali
              </Text>
              <View style={styles.materialMeta}>
                <Text style={styles.materialAuthor}>Prof. M. Rossi</Text>
                <Text style={styles.materialDot}>•</Text>
                <Text style={styles.materialDate}>1 settimana fa</Text>
                <Text style={styles.materialDot}>•</Text>
                <Text style={styles.materialDuration}>24 min</Text>
              </View>
            </View>
            <Pressable style={styles.materialDownload}>
              <Ionicons name="play" size={20} color="#2b7fff" />
            </Pressable>
          </View>

          {/* Statistiche Lezioni */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Riepilogo Lezioni</Text>
          </View>

          <View style={styles.lessonsStatsCard}>
            <View style={styles.lessonsStatsRow}>
              <View style={styles.lessonStatItem}>
                <Text style={styles.lessonStatValue}>12</Text>
                <Text style={styles.lessonStatLabel}>Completate</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.lessonStatItem}>
                <Text style={styles.lessonStatValue}>3</Text>
                <Text style={styles.lessonStatLabel}>Programmate</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.lessonStatItem}>
                <Text style={styles.lessonStatValue}>8</Text>
                <Text style={styles.lessonStatLabel}>Disponibili</Text>
              </View>
            </View>
            <Pressable
              style={styles.bookLessonButton}
              onPress={() =>
                setToast({
                  visible: true,
                  message: "Funzionalità prenotazione in arrivo!",
                  type: "info",
                })
              }
            >
              <LinearGradient
                colors={["#2b7fff", "#1e6edb"]}
                style={styles.bookLessonGradient}
              >
                <Ionicons name="calendar" size={20} color="#fff" />
                <Text style={styles.bookLessonText}>Prenota Nuova Lezione</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
      colors={["#0a0e1a", "#0d1117", "#0a0e1a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
              colors={["#2b7fff", "#1e6edb"]}
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
              <Text style={styles.accountStatValue}>156</Text>
              <Text style={styles.accountStatLabel}>Problemi risolti</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.accountStatValue}>24</Text>
              <Text style={styles.accountStatLabel}>Giorni di streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.accountStatValue}>8.5</Text>
              <Text style={styles.accountStatLabel}>Media voti</Text>
            </View>
          </View>
        </View>

        {/* Sezione Corsi */}
        <View style={styles.section}>
          <Text style={styles.accountSectionTitle}>I miei corsi</Text>
          <View style={styles.courseCard}>
            <View style={styles.courseIconContainer}>
              <LinearGradient
                colors={["#2b7fff", "#1e6edb"]}
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
                colors={["#2b7fff", "#1e6edb"]}
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
          <Text style={styles.accountSectionTitle}>Obiettivi settimanali</Text>
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
          <Text style={styles.accountSectionTitle}>Impostazioni</Text>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={22} color="#2b7fff" />
              <Text style={styles.settingText}>Notifiche</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#71767b" />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={22} color="#2b7fff" />
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
        <StudentChat />
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(43, 127, 255, 0.15)",
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
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  messageBubble: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  messageTextContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  messageGradient: {
    padding: 16,
    paddingHorizontal: 20,
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  userMessageText: {
    color: "#ffffff",
  },
  botMessageText: {
    color: "#f5f5f5",
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
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 20,
    fontWeight: "500",
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
    borderRadius: 22,
    overflow: "hidden",
  },
  attachButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mathButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  mathPreviewInInput: {
    backgroundColor: "rgba(43, 127, 255, 0.1)",
    borderRadius: 16,
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
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreviewContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
  },
  removeImageButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  accountStatValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d9bf0",
    marginBottom: 4,
  },
  accountStatLabel: {
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
  accountSectionTitle: {
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
    backgroundColor: "rgba(43, 127, 255, 0.15)",
    borderColor: "#2b7fff",
    shadowColor: "#2b7fff",
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
    color: "#2b7fff",
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
    backgroundColor: "rgba(43, 127, 255, 0.15)",
    borderColor: "#2b7fff",
    shadowColor: "#2b7fff",
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
    color: "#2b7fff",
    fontWeight: "600",
  },
  dateNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  dateNumberActive: {
    color: "#2b7fff",
  },
  dateMonth: {
    fontSize: 12,
    color: "#71767b",
  },
  dateMonthActive: {
    color: "#2b7fff",
    fontWeight: "600",
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2b7fff",
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
    borderColor: "rgba(43, 127, 255, 0.2)",
  },
  timeSlotActive: {
    backgroundColor: "rgba(43, 127, 255, 0.15)",
    borderColor: "#2b7fff",
    shadowColor: "#2b7fff",
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
  // New Home Styles
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 15,
    color: "#71767b",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  statCardGradient: {
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#71767b",
    marginTop: 4,
  },
  weeklyGoalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  weeklyGoalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weeklyGoalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  weeklyGoalProgress: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2b7fff",
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  weeklyGoalSubtext: {
    fontSize: 13,
    color: "#71767b",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  seeAllText: {
    fontSize: 14,
    color: "#2b7fff",
    fontWeight: "500",
  },
  challengeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  challengeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeLeft: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  challengeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "600",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#71767b",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
  },
  categoryGradient: {
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 12,
  },
  categoryExercises: {
    fontSize: 12,
    color: "#71767b",
    marginTop: 4,
    marginBottom: 12,
  },
  categoryProgressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  categoryProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  categoryProgressText: {
    fontSize: 11,
    color: "#71767b",
  },
  leaderboardCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  leaderboardItemMe: {
    backgroundColor: "rgba(43, 127, 255, 0.1)",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  leaderboardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#71767b",
    width: 30,
  },
  leaderboardAvatar: {
    fontSize: 24,
  },
  leaderboardName: {
    fontSize: 15,
    color: "#fff",
  },
  leaderboardNameMe: {
    fontWeight: "600",
    color: "#2b7fff",
  },
  leaderboardPoints: {
    fontSize: 14,
    fontWeight: "600",
    color: "#71767b",
  },
  leaderboardPointsMe: {
    color: "#2b7fff",
  },
  // Performance Stats
  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  performanceCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  performanceIconContainer: {
    marginBottom: 12,
  },
  performanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: "#71767b",
    textAlign: "center",
  },
  // Activity Calendar
  activityCalendar: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  activitySubtext: {
    fontSize: 13,
    color: "#71767b",
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 12,
  },
  calendarWeek: {
    flexDirection: "column",
    gap: 4,
  },
  calendarDay: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  calendarLegend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 12,
  },
  legendText: {
    fontSize: 11,
    color: "#71767b",
  },
  legendDots: {
    flexDirection: "row",
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  // Lessons Section
  lessonCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(43, 127, 255, 0.3)",
    marginBottom: 12,
  },
  lessonCardPast: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
    opacity: 0.7,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  lessonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonProfName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  lessonProfNamePast: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 2,
  },
  lessonSubject: {
    fontSize: 13,
    color: "#71767b",
  },
  lessonSubjectPast: {
    fontSize: 13,
    color: "#64748b",
  },
  lessonBadge: {
    backgroundColor: "rgba(43, 127, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lessonBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2b7fff",
  },
  lessonBadgePast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lessonBadgeTextPast: {
    fontSize: 11,
    fontWeight: "600",
    color: "#22c55e",
  },
  lessonDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  lessonDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lessonDetailText: {
    fontSize: 13,
    color: "#e7e9ea",
  },
  lessonDetailTextPast: {
    fontSize: 13,
    color: "#71767b",
  },
  lessonTopics: {
    flexDirection: "row",
    gap: 8,
  },
  topicTag: {
    backgroundColor: "rgba(43, 127, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topicTagText: {
    fontSize: 12,
    color: "#2b7fff",
    fontWeight: "500",
  },
  // Material Section
  materialCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 12,
  },
  materialIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  materialMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  materialAuthor: {
    fontSize: 12,
    color: "#71767b",
  },
  materialDot: {
    fontSize: 12,
    color: "#71767b",
  },
  materialDate: {
    fontSize: 12,
    color: "#71767b",
  },
  materialDuration: {
    fontSize: 12,
    color: "#71767b",
  },
  materialDownload: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(43, 127, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Lessons Stats
  lessonsStatsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  lessonsStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  lessonStatItem: {
    flex: 1,
    alignItems: "center",
  },
  lessonStatValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2b7fff",
    marginBottom: 4,
  },
  lessonStatLabel: {
    fontSize: 12,
    color: "#71767b",
    textAlign: "center",
  },
  bookLessonButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  bookLessonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  bookLessonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  // Old Teacher Booking Styles (kept for compatibility)
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
  // Brand Identity
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2b7fff",
    letterSpacing: 0.5,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2b7fff",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  brandPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  brandPatternDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(43, 127, 255, 0.15)",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  statIconContainer: {
    position: "relative",
    marginBottom: 8,
  },
  statIconGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(43, 127, 255, 0.3)",
    borderRadius: 20,
    opacity: 0.6,
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
  chatSelectorBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#0a0e1a",
  },
  chatSelectorBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  chatNotificationBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  chatNotificationText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
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
