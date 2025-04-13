import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { url } from "@/constants/Endpoint";

const DepositsHistory = ({ chamaId }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const getDeposits = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      try {
        const response = await fetch(`${url}/chama/deposits/${chamaId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const results = await response.json();
        if (response.ok) {
          setDeposits(results.deposits);
        } else {
          console.log("an issue with the api");
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDeposits();
  }, []);

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const renderItem = ({ item }) => (
    <View style={styles.depositItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.userName}>You locked </Text>
      </View>
      <View style={styles.amountInfo}>
        <Text style={styles.amountText}>
          {Number(item.amount) / 10 ** 18} cKES
        </Text>
        <Text style={styles.dateText}>
          {dateFormat.format(new Date(item.doneAt))}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Deposits History</Text>

      {deposits.length === 0 ? (
        <View style={styles.noDeposits}>
          <Text>No deposits made.</Text>
        </View>
      ) : (
        <FlatList
          data={deposits}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          nestedScrollEnabled
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#4A5568",
  },
  noDeposits: {
    alignItems: "center",
    marginTop: 8,
  },
  depositItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
  },
  dateText: {
    fontSize: 14,
    color: "#A0AEC0",
  },
  amountInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3B82F6",
  },
});

export default DepositsHistory;
