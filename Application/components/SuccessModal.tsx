import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SuccessModal = ({
  amount,
  chamaName,
  visible,
  onClose,
  viewOnExplorer,
}: {
  amount: string;
  chamaName: string;
  visible: boolean;
  onClose: Function;
  viewOnExplorer: Function;
}) => {
  const router = useRouter();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
        // router.push("/(tabs)"); // Navigate to tabs after closing
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Ionicons name="checkmark-circle" size={48} color="#4ADE80" />
            <Text style={styles.modalTitle}>Payment Successful!</Text>
          </View>

          <Text style={styles.modalText}>
            You've sent {amount} cKES to {chamaName}
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => onClose()}
            >
              <Text style={styles.secondaryButtonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => viewOnExplorer}
            >
              <Text style={styles.primaryButtonText}>View on Explorer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
  },
  modalText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#A5E4F6",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "black",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "gray",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "black",
    fontWeight: "600",
  },
});

export default SuccessModal;
