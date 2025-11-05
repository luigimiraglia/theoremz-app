import { styles } from "@/app/components/App.styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../src/auth";
import { Toast } from "../src/Toast";

export default function AccountPage() {
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
