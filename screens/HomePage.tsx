import { styles } from "@/app/components/App.styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/auth";
import { Toast } from "../src/Toast";

export default function HomePage() {
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
