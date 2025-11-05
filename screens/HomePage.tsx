import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
        <ScrollView
          style={[styles.container, { paddingTop: insets.top + 20 }]}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.homeHeader}>
            <View>
              <Text style={styles.brandName}>theoremz</Text>
              <Text style={styles.greetingText}>Ciao! 👋</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={28} color="#2b7fff" />
              <Text style={styles.statValue}>{userStats.problemsSolved}</Text>
              <Text style={styles.statLabel}>Problemi</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={28} color="#10b981" />
              <Text style={styles.statValue}>{userStats.currentStreak}</Text>
              <Text style={styles.statLabel}>Giorni</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={28} color="#f59e0b" />
              <Text style={styles.statValue}>{userStats.totalPoints}</Text>
              <Text style={styles.statLabel}>Punti</Text>
            </View>
          </View>

          {/* Categorie */}
          <Text style={styles.sectionTitle}>Argomenti</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={styles.categoryCard}
                onPress={() => setSelectedTopic(category.id)}
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
              </Pressable>
            ))}
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

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2b7fff",
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 18,
    color: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#71767b",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  categoryExercises: {
    fontSize: 12,
    color: "#71767b",
  },
});
