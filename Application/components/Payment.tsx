import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import TransactionDetails from "./Transactions";

interface UserTx {
  blockHash: string;
  blockNumber: string;
  contractAddress: string;
  from: string;
  hash: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: string;
}

const PaymentsList = ({
  payments,
  userAddress,
  refresh,
  refreshing,
}: {
  payments: UserTx[];
  userAddress: string;
  refresh: () => void;
  refreshing: boolean;
}) => {
  const [selectedTx, setSelectedTx] = useState<UserTx | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const formatValue = (value: string, decimals: string) => {
    return (parseInt(value) / 10 ** parseInt(decimals)).toFixed(2);
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second:"2-digit",
      }
    );
  };

  const isIncoming = (tx: UserTx) => {
    return tx.to.toLowerCase() === userAddress?.toLowerCase();
  };

  const renderTransaction = ({ item }: { item: UserTx }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedTx(item);
        setModalVisible(true);
      }}
    >
      <View
        style={[
          styles.transactionContainer,
          isIncoming(item) ? styles.incoming : styles.outgoing,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={isIncoming(item) ? "arrow-down" : "arrow-up"}
            size={22}
            color={isIncoming(item) ? "#2e7d32" : "#c62828"}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.address}>
            {isIncoming(item)
              ? `From: ${item.from.slice(0, 6)}...${item.from.slice(-4)}`
              : `To: ${item.to.slice(0, 6)}...${item.to.slice(-4)}`}
          </Text>
          <Text style={styles.date}>{formatDate(item.timeStamp)}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              isIncoming(item) ? styles.amountIncoming : styles.amountOutgoing,
            ]}
          >
            {isIncoming(item) ? "+" : "-"}
            {formatValue(item.value, item.tokenDecimal)} {item.tokenSymbol}
          </Text>
          <Text style={styles.tag}>
            {isIncoming(item) ? "Received" : "Sent"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transactions History</Text>

      <FlatList
        data={payments}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => `${item.hash}-${index}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={52} color="#b0bec5" />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={['#32a852']}
            tintColor="#32a852"
          />
        }
      />

      {selectedTx && (
        <TransactionDetails
          visible={modalVisible}
          transaction={selectedTx}
          onClose={() => {
            setModalVisible(false);
            setSelectedTx(null);
          }}
          isIncoming={isIncoming(selectedTx)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "#f9fafa",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#263238",
    marginVertical: 16,
    textAlign: "center",
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  incoming: {
    borderLeftWidth: 4,
    borderLeftColor: "#81c784",
  },
  outgoing: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef9a9a",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  address: {
    fontSize: 15,
    fontWeight: "600",
    color: "#37474f",
  },
  date: {
    fontSize: 12,
    color: "#78909c",
    marginTop: 4,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  amountIncoming: {
    color: "#2e7d32",
  },
  amountOutgoing: {
    color: "#c62828",
  },
  tag: {
    marginTop: 4,
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#eceff1",
    overflow: "hidden",
    color: "#455a64",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#b0bec5",
    marginTop: 14,
  },
});

export default PaymentsList;
