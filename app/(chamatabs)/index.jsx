import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
// import { useSearchParams } from 'expo-router';

import PaymentModal from "@/components/Pay";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChamaDetailsScreen = () => {
  const [started, setStarted] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [included, setIncluded] = useState(true);
  const chama = {
    id: 1,
    name: "Chama 1",
    amount: 100,
    cycle: "month",
    payDate: Date.now(),
    startDate: Date.now(),
    nextPayout: "2024-12-01",
  };
  const route = useRoute();
  const { chamaId } = route.params || {};

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.statusContainer}>
        {started === true ? (
          <View style={styles.status}>
            <View style={styles.statusCircleStarted} />
            <Text>Started</Text>
            <Text>Chama Details Screen</Text>
            <Text>Chama ID: {chamaId}</Text>
          </View>
        ) : (
          <View style={styles.status}>
            <View style={styles.statusCircleNotStarted} />
            <Text>Not Started</Text>
          </View>
        )}
      </View>

      <View style={styles.chamaCard}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `https://ipfs.io/ipfs/Qmd1VFua3zc65LT93Sv81VVu6BGa2QEuAakAFJexmRDGtX/1.jpg`,
            }}
            style={styles.image}
          />
        </View>

        {/* Chama Details */}
        <Text style={styles.chamaTitle}>{chama.name}</Text>
        <Text style={styles.chamaAmount}>
          {chama.amount} cKES/{chama.cycle}
        </Text>
        <Text style={styles.chamaMembers}>2 Members</Text>
        <Text style={styles.chamaDate}>
          {started === true
            ? `PayDate: ${dateFormat.format(chama.payDate)}`
            : `StartDate: ${dateFormat.format(chama.startDate)}`}
        </Text>

        {/* Pay Button */}
        <View style={styles.buttonContainer}>
          {!included ? (
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => setOpenModal(true)}
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SVG/Icon */}
        {included && (
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="chatbubbles-outline" size={24} />
          </TouchableOpacity>
        )}
      </View>
      {openModal && (
        <PaymentModal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          chamaId={chamaId}
          chamaName={chama.name}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    padding: 20,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCircleStarted: {
    width: 12,
    height: 12,
    backgroundColor: "green",
    borderRadius: 6,
    marginRight: 8,
  },
  statusCircleNotStarted: {
    width: 12,
    height: 12,
    backgroundColor: "gray",
    borderRadius: 6,
    marginRight: 8,
  },
  chamaCard: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    padding: 16,
    marginTop: 16,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  chamaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  chamaAmount: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  chamaMembers: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  chamaDate: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  payButton: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: "#00796B",
  },
});

export default ChamaDetailsScreen;
