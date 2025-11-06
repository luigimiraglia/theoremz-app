import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { fetchAllConversations } from "../lib/chatApi";

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  student: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
  };
  lastMessage: {
    id: string;
    body: string;
    created_at: string;
    sender_id: string;
  } | null;
}

interface TutorDashboardProps {
  onSelectConversation: (conversationId: string, studentName: string) => void;
}

export default function TutorDashboard({
  onSelectConversation,
}: TutorDashboardProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setError(null);
      const data = await fetchAllConversations();
      setConversations(data);
    } catch (err: any) {
      console.error("Error loading conversations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ora";
    if (diffMins < 60) return `${diffMins}m fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays < 7) return `${diffDays}g fa`;
    return date.toLocaleDateString();
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const studentName = item.student.full_name || item.student.email;
    const lastMessageText = item.lastMessage?.body || "Nessun messaggio";
    const lastMessageTime = item.lastMessage
      ? formatTime(item.lastMessage.created_at)
      : "";

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => onSelectConversation(item.id, studentName)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {studentName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.studentName}>{studentName}</Text>
            {lastMessageTime && (
              <Text style={styles.timestamp}>{lastMessageTime}</Text>
            )}
          </View>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {lastMessageText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Caricamento conversazioni...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Errore: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadConversations}>
          <Text style={styles.retryButtonText}>Riprova</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Tutor</Text>
        <Text style={styles.headerSubtitle}>
          {conversations.length} conversazion{conversations.length !== 1 ? "i" : "e"}
        </Text>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nessuna conversazione attiva al momento
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  listContent: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
