import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal } from "react-native";

const Lock = ({
  visible,
  onClose,
  onProceed,
  loading,
  errText,
  buttonText,
  amount,
  name,
  creation,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          {errText ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={20} color="#ff4444" />
              <Text style={styles.errorText}>{errText}</Text>
            </View>
          ) : null}

          {/* Modal Content */}
          <Text style={styles.title}>Lock Amount</Text>
          <Text style={styles.description}>
            You need to lock the required {amount} cKES before{" "}
            {creation ? "creating" : "joining"} {name} public chama.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={loading ? undefined : onClose}
              disabled={loading}
              style={[
                styles.button,
                styles.cancelButton,
                loading && styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Proceed Button */}
            <TouchableOpacity
              onPress={onProceed}
              disabled={loading}
              style={[
                styles.button,
                styles.proceedButton,
                loading && styles.disabledButton,
              ]}
            >
              {loading ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>{buttonText}</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Proceed</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffeeee",
    padding: 8,
    marginTop: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  proceedButton: {
    backgroundColor: "#4caf50",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Lock;
