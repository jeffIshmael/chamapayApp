import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../constants/Endpoint";

export default function CreateFamily() {
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

  const handleSubmit = async () => {
    // Validation check
    if (!groupName || !amount || !startDate || !duration) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    try {
      setIsPending(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(`${url}/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: groupName,
          amount: parseFloat(amount),
          maxNo: parseInt(maxPeople) || 0,
          days: parseInt(duration),
          startDate: new Date(startDate).getTime() / 1000, // Convert to Unix timestamp
          isPublic: false,
        }),
      });
      const results = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Chama created successfully!");
        console.log(results);
      } else {
        console.log("unsuccessful");
        console.log(results);
        setErrorMessage("Failed to create chama. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Ionicons name="people" size={20} color={"#63c5da"} />
        <TextInput
          placeholder="Enter Group Name"
          value={groupName}
          onChangeText={setGroupName}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Contribution Amount (cKes)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Select Date"
          value={startDate.split(" ")[0]}
          style={styles.input}
          onFocus={() => setShowDatePicker(true)}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={24} color="#63c5da" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Select Time"
          value={startDate.split(" ")[1]}
          style={styles.input}
          onFocus={() => setShowTimePicker(true)}
        />
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time" size={24} color="#63c5da" />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Cycle Time (in days)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isPending}
        style={isPending ? styles.buttonDisabled : styles.button}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Chama</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: "100%",
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#63c5da",
    paddingBottom: 4,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#63c5da",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
