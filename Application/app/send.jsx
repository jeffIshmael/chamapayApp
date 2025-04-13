import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import {background} from "@/constants/Colors";

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
          placeholderTextColor="#aaa"
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
          placeholderTextColor="#aaa"
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
    backgroundColor: background,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  note: {
    fontSize: 14,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  textInput: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  amountContainer: {
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  maxButton: {
    backgroundColor: "#008080",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  maxButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  feeContainer: {
    marginBottom: 30,
  },
  feeText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  sendButton: {
    backgroundColor: "#008080",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
};

export default SendScreen;