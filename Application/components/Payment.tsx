import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"; // Make sure to install and link react-native-vector-icons

import Transactions from "@/components/Transactions";

const PaymentsList = () => {
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

  const payments = [
    {
      id: 1,
      type: "withdraw",
      from: "0x32134",
      to: "0x567...987",
      amount: 23,
      txHash: "0x563sjja",
      time: new Date(Date.now()),
    },
    {
      id: 2,
      type: "deposit",
      from: "0x32134",
      to: "0x567...987",
      amount: 24,
      txHash: "0x563sjja",
      time: new Date(Date.now()),
    },
    {
      id: 3,
      type: "withdraw",
      from: "0x32134",
      to: "0x567...987",
      amount: 123,
      txHash: "0x563sjja",
      time: new Date(Date.now()),
    },
  ];

  const renderPayment = ({ item }: { item: any }) => (
    <View>
      <TouchableOpacity onPress={() => {
        // Toggle the details visibility for this payment item
        setSelectedPaymentId((prev) => (prev === item.id ? null : item.id));
      }}>
        <View style={styles.paymentContainer}>
          {/* Payment Details */}
          <View style={styles.paymentDetails}>
            <View style={styles.iconContainer}>
              <Ionicons name="filter-outline" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.paymentTitle}>Payment to {item.to}</Text>
              <Text style={styles.paymentDate}>
                {new Date(Date.now()).toLocaleString()}
              </Text>
            </View>
          </View>
          {/* Payment Amount */}
          <Text style={styles.paymentAmount}> {item.amount} cKES</Text>
          {/* Transaction Link */}
          <TouchableOpacity>
            <Ionicons
              name="return-down-forward-outline"
              size={24}
              color="#3ABAB4"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {/* Show details only for the selected payment */}
      {selectedPaymentId === item.id && (
        <Transactions transaction={item} visible={true} onClose={() => setSelectedPaymentId(null)} />
      )}
    </View>
  );

  return (
    <FlatList
      data={payments}
      renderItem={({ item }) => renderPayment({ item })}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#E0F4F1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#37B7AD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  paymentDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#37B7AD",
    padding: 8,
    borderRadius: 50,
    marginRight: 8,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  paymentDate: {
    fontSize: 12,
    color: "#666",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3ABAB4",
  },
});

export default PaymentsList;
