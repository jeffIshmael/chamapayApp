import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";

const SendScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Send Funds</Text>

      {/* Note */}
      <Text style={styles.note}>Note: Only supports sending to a ChamaPay user.</Text>

      {/* Recipient Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Recipient's Email / Wallet Address / Phone No. / Username</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email / Wallet Address / Phone No. / Username"
          keyboardType="ascii-capable"
        />
      </View>

      {/* Amount Input */}
      <View style={styles.amountContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <TouchableOpacity style={styles.maxButton}>
            <Text style={styles.maxButtonText}>Max</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Amount"
          keyboardType="numeric"
        />
      </View>

      {/* Fee Information */}
      <View style={styles.feeContainer}>
        <Text style={styles.feeText}>Fee: No fees</Text>
      </View>

      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  note: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#555",
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  amountContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  maxButton: {
    backgroundColor: "#008080",
    padding: 5,
    borderRadius: 5,
  },
  maxButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  feeContainer: {
    marginBottom: 20,
  },
  feeText: {
    fontSize: 14,
    color: "#777",
  },
  sendButton: {
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
};

export default SendScreen;