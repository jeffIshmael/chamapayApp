import { url } from "@/constants/Endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: Date;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        const response = await fetch(`${url}/user/notifications`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const results = await response.json();
        if (response.ok) {
          setNotifications(results);
        } else {
          console.log(results.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getNotifications();
  }, []);

  const renderNotification = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          item.read && styles.readNotification,
        ]}
        onPress={() => markAsRead(item.id)}
      >
        <Text style={item.read && styles.readMessage}>{item.message}</Text>
        <View style={styles.notificationFooter}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const markAsRead = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await fetch(`${url}/notifications/${id}/read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      } else {
        console.log("Failed to mark notification as read");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#63c5da" />
        </View>
      )}

      {!loading && notifications.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            You have no notifications yet.
          </Text>
        </View>
      )}

      {!loading && notifications.length > 0 && (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  list: {
    flexGrow: 1,
  },
  notificationCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 12,
  },
  readNotification: {
    backgroundColor: "#f0f8ff", // Light blue background for read notifications
  },
  readMessage: {
    color: "#666", // Dimmed text color for read notifications
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#aaa",
  },
});