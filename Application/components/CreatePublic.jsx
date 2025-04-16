import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { url } from "@/constants/Endpoint";
import Lock from "./Lock";

export default function CreatePublic() {
  const [groupName, setGroupName] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openLockModal, setOpenLocalModal] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const router = useRouter();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setStartDate(currentDate.toLocaleDateString());
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || date;
    setShowTimePicker(false);
    setDate(currentTime);
    setStartDate((prev) => `${prev} ${currentTime.toLocaleTimeString()}`);
  };

  //fnction to check legibility of inputs
  const checkLegibility = () => {
    setErrorMessage("");
    if (!groupName || !amount || !startDate || !duration || !maxPeople) {
      setErrorMessage("Please fill in all required fields");
      return;
    }
    if (Number(maxPeople) <= 1) {
      setErrorMessage("Maximum people must be greater than 1");
      return;
    }
    if (Number(amount) < 1) {
      setErrorMessage("Minimum amount should be 1 cKES.");
      return;
    }
    if (Number(duration) < 1) {
      setErrorMessage("Minimum duration should be 1 day.");
      return;
    }
    setOpenLocalModal(true);
  };

  //function to handle the locking of amount b4 chama creation
  const sendCKES = async (amount, token) => {
    try {
      setButtonText(`Locking ...`);
      const response = await fetch(`${url}/chama/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          chamaId: null,
          creation: true,
        }),
      });
      const results = await response.json();
      if (response.ok) {
        //return the txHash
        return results;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      setIsPending(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const txHash = await sendCKES(amount, token);
      if (!txHash) {
        setErrorMessage("Failed to send cKES! Ensure you have enough balance");
        return;
      }
      setButtonText(`Creating ${groupName}...`);
      const response = await fetch(`${url}/chama/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: groupName,
          amount: parseFloat(amount),
          maxNo: parseInt(maxPeople),
          days: parseInt(duration),
          startDate: startDate,
          isPublic: true,
          txHash: txHash,
        }),
      });
      const results = await response.json();
      if (response.ok) {
        // Reset all form fields
        setGroupName("");
        setMaxPeople("");
        setAmount("");
        setStartDate("");
        setDuration("");
        setDate(new Date()); // Reset the date picker to current date

        Alert.alert(
          "Success",
          `✨ ${results.createdChama.name.toUpperCase()} chama ✨\n\nCreated successfully!`,
          [{ text: "OK", onPress: () => router.push({ pathname: "/(tabs)" }) }]
        );
      } else {
        setErrorMessage(results.message || "Failed to create chama");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={20} color="#ff4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Group Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="globe"
                size={20}
                color="#63c5da"
                style={styles.icon}
              />
              <TextInput
                placeholder="e.g. Community Savings"
                placeholderTextColor="#999"
                value={groupName}
                onChangeText={setGroupName}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Contribution Amount (cKES) — Min. 1 cKES
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="cash"
                size={20}
                color="#63c5da"
                style={styles.icon}
              />
              <TextInput
                placeholder="e.g. 2000"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Max Members</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="people"
                size={20}
                color="#63c5da"
                style={styles.icon}
              />
              <TextInput
                placeholder="e.g. 50"
                placeholderTextColor="#999"
                value={maxPeople}
                onChangeText={setMaxPeople}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date & Time</Text>
            <View style={styles.datetimeContainer}>
              <TouchableOpacity
                style={styles.datetimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={18} color="#63c5da" />
                <Text style={styles.datetimeText}>
                  {startDate.split(" ")[0] || "Select Date"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.datetimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time" size={18} color="#63c5da" />
                <Text style={styles.datetimeText}>
                  {startDate.split(" ")[1] || "Select Time"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cycle Duration (days) — Min. 1 day</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="repeat"
                size={20}
                color="#63c5da"
                style={styles.icon}
              />
              <TextInput
                placeholder="e.g. 30"
                placeholderTextColor="#999"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
            />
          )}
          <TouchableOpacity
            onPress={checkLegibility}
            disabled={isPending}
            style={[
              styles.submitButton,
              isPending && styles.submitButtonDisabled,
            ]}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="earth"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.submitButtonText}>Create Public Chama</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Lock
        visible={openLockModal}
        onClose={() => setOpenLocalModal(false)}
        onProceed={handleSubmit}
        loading={isPending}
        errText={errorMessage}
        buttonText={buttonText}
        amount={amount}
        name={groupName}
        creation={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffeeee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: "#ff4444",
    marginLeft: 8,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafb",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datetimeButton: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafb",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
  },
  datetimeText: {
    marginLeft: 8,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#63c5da",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#8bb8f0",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
