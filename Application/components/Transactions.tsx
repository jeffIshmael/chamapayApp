import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { background } from "@/constants/Colors";

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

interface TransactionDetailsProps {
  visible: boolean;
  transaction: UserTx;
  onClose: () => void;
  isIncoming: boolean;
}

const TransactionDetails = ({
  visible,
  transaction,
  onClose,
  isIncoming,
}: TransactionDetailsProps) => {
  const handleViewOnExplorer = () => {
    const explorerUrl = `https://explorer.celo.org/tx/${transaction.hash}`;
    Linking.openURL(explorerUrl).catch((err) =>
      console.error("Failed to open explorer:", err)
    );
  };

  const formatValue = (value: string, decimals: string) => {
    return (parseInt(value) / 10 ** parseInt(decimals)).toFixed(2);
  };

  const formatAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {isIncoming ? "Received" : "Sent"} {transaction.tokenSymbol}
            </Text>
            <Text
              style={[
                styles.amount,
                isIncoming ? styles.amountIncoming : styles.amountOutgoing,
              ]}
            >
              {isIncoming ? "+" : "-"}
              {formatValue(transaction.value, transaction.tokenDecimal)}
            </Text>
            <ScrollView style={styles.detailsContainer}>
              <DetailRow label="Status" value="Confirmed" showCopy={false} />
              <DetailRow
                label={isIncoming ? "From" : "To"}
                value={
                  isIncoming
                    ? formatAddress(transaction.from)
                    : formatAddress(transaction.to)
                }
                showCopy={true}
              />
              <DetailRow
                label="Transaction Hash"
                value={formatAddress(transaction.hash)}
                showCopy={true}
              />
              <DetailRow
                label="Date"
                value={new Date(
                  parseInt(transaction.timeStamp) * 1000
                ).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                showCopy={false}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.viewOnExplorer}
              onPress={handleViewOnExplorer}
            >
              <Text style={styles.explorerText}>View on Explorer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const DetailRow = ({
  label,
  value,
  showCopy,
}: {
  label: string;
  value: string;
  showCopy: boolean;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.valueContainer}>
      <Text
        style={[
          styles.detailValue,
          value === "Confirmed" && styles.confirmedText,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
      {showCopy && (
        <TouchableOpacity style={styles.copyButton}>
          <Ionicons name="copy-outline" size={18} color="#90a4ae" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  amountIncoming: {
    color: "#4CAF50",
  },
  amountOutgoing: {
    color: "#c62828",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  detailLabel: {
    color: "#90a4ae",
    fontSize: 14,
  },
  detailValue: {
    color: "#263238",
    fontSize: 14,
    fontWeight: "500",
    maxWidth: "60%",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    marginLeft: 16, // Add some space between label and value
  },

  copyButton: {
    padding: 4,
  },
  confirmedText: {
    color: "#3ABAB4",
  },
  viewOnExplorer: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  explorerText: {
    color: "#1976d2",
    fontWeight: "600",
  },
});

export default TransactionDetails;
