import { View, Text, TouchableOpacity, Linking, StyleSheet, Modal } from "react-native";
import React from "react";

const TransactionScreen = ({ transaction, visible, onClose }) => {

  console.log(transaction);
  const openTransactionLink = (txHash) => {
    const url = `https://celoscan.io/tx/${txHash}`;
    Linking.openURL(url).catch((err) => console.error("Couldn't open URL", err));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.header}>Transaction Details</Text>

          <View style={styles.details}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{transaction.id}</Text>

            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{transaction.type}</Text>

            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{transaction.from} (You)</Text>

            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{transaction.to}</Text>

            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{transaction.amount} cKES</Text>

            <Text style={styles.label}>Time:</Text>
            {/* <Text style={styles.value}>{transaction.time}</Text> */}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => openTransactionLink(transaction.txHash)}>
              <Text style={styles.buttonText}>View on Explorer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  details: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginTop: 6,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#008080",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransactionScreen;
