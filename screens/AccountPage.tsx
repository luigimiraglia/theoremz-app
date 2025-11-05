import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
          <LinearGradient
            colors={["#2b7fff", "#1e6edb"]}
            style={styles.profileAvatar}
          >
            <Text style={styles.profileAvatarText}>LM</Text>
          </LinearGradient>
          <Text style={styles.profileName}>Luigi Miraglia</Text>
          <Text style={styles.profileEmail}>ermattissimo@gmail.com</Text>
        </View>

        {/* Impostazioni */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impostazioni</Text>

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
            <Text style={styles.settingValue}>Italiano</Text>
          </Pressable>

          <Pressable style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out" size={22} color="#ef4444" />
              <Text style={[styles.settingText, { color: "#ef4444" }]}>
                Esci
              </Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.footerText}>Theoremz v1.0.0</Text>
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

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
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
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#fff",
  },
  settingValue: {
    fontSize: 14,
    color: "#71767b",
  },
  footerText: {
    textAlign: "center",
    color: "#71767b",
    fontSize: 12,
    paddingVertical: 24,
  },
});
