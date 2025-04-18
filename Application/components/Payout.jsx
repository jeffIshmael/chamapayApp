import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const PayoutsHistory = (payouts) => {

  const payoutArray = payouts.payouts;
  const renderItem = ({ item }) => (
    <View style={styles.payoutItem}>
      <View style={styles.itemHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.icon}>💸</Text>
          <Text style={styles.userName}>
            {item.user.name
              ? item.user.name
              : `${item.user.address.slice(0, 6)}...${item.user.address.slice(
                  -4
                )}`}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(item.timestamp).toDateString()}
        </Text>
      </View>
      <View style={styles.amountInfo}>
        <Text style={styles.cycleText}>Cycle 1</Text>
        <Text style={styles.amountText}>
          {Number(item.amount) / 10 ** 18} cKES
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payout History</Text>

      {payoutArray.length === 0 ? (
        <View style={styles.nopayouts}>
          <Text>No payouts found.</Text>
        </View>
      ) : (
        <FlatList
          data={payoutArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
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
  nopayouts: {
    alignItems: "center",
    marginTop: 8,
  },
  payoutItem: {
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    color: "#66D9D0",
    marginRight: 8,
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
  cycleText: {
    fontSize: 16,
    color: "#4A5568",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#66D9D0",
  },
});

export default PayoutsHistory;
