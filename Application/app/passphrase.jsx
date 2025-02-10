import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

const PassphraseScreen = () => {
  const router = useRouter();
  const { passPhrase } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Recovery Passphrase</Text>

      {/* Instructions */}
      <Text style={styles.instruction}>
        Please save this passphrase in a secure place. It will be used to
        recover your account if you lose access.
      </Text>

      {/* Mnemonic Words */}
      <View style={styles.mnemonicContainer}>
        {passPhrase?.split(" ").map((word, index) => (
          <View key={index} style={styles.wordContainer}>
            <Text style={styles.wordIndex}>{index + 1}.</Text>
            <Text style={styles.wordText}>{word}</Text>
          </View>
        ))}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          router.push("/profile");
        }}
      >
        <Text style={styles.confirmButtonText}>I have saved my passphrase</Text>
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
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  mnemonicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  wordContainer: {
    backgroundColor: "#eaeaea",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: "center",
    minWidth: 80,
  },
  wordIndex: {
    fontSize: 14,
    color: "#777",
    fontWeight: "bold",
  },
  wordText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
};

export default PassphraseScreen;
