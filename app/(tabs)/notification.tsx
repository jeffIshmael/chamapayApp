import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { Linking } from "react-native";

export default function NotificationsScreen ()  {
  // Handle join request

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <ScrollView>
        <View style={styles.notificationCard}>
          <Text>message</Text>
          <View style={styles.notificationFooter}>
            <Text style={styles.dateText}>
              {new Date(Date.now()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            {/* {isPending && (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => handleJoin(notification.id, "approve", notification.chamaId ?? 0, notification.senderId, notification.requestId ?? 0)}
                        style={[styles.button, styles.approveButton, loading && styles.disabledButton]}
                        disabled={loading}
                      >
                        <Text style={styles.buttonText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleJoin(notification.id, "reject", notification.chamaId ?? 0, notification.senderId, notification.requestId ?? 0)}
                        style={[styles.button, styles.rejectButton, loading && styles.disabledButton]}
                        disabled={loading}
                      >
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )} */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F7FA", padding: 16 },
  header: { fontSize: 20, fontWeight: "bold", marginTop: 16, color: "#000" },
  loading: { width: 100, height: 100, alignSelf: "center", marginTop: 20 },
  noNotifications: { alignItems: "center", marginTop: 20 },
  notificationCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginVertical: 8,
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateText: { color: "#555" },
  buttonContainer: { flexDirection: "row", gap: 10 },
  button: { padding: 8, borderRadius: 5 },
  approveButton: { backgroundColor: "#00C853" },
  rejectButton: { backgroundColor: "#D32F2F" },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  disabledButton: { opacity: 0.5 },
});


