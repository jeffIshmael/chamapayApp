import { url } from "@/constants/Endpoint";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import SuccessModal from "./SuccessModal";
import { background } from "@/constants/Colors";

const CKESPay = ({
  visible,
  onClose,
  onSuccess,
  chamaId,
  chamaBlockchainId,
  chamaName,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  chamaId: number;
  chamaBlockchainId: number;
  chamaName: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [fetchingTxFee, setFetchingTxFee] = useState(false);
  const [transactionFee, setTransactionFee] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Validate input
      const paymentAmount = Number(amount);
      if (!paymentAmount || paymentAmount <= 0 || isNaN(paymentAmount)) {
        setError("Please enter a valid amount");
        return;
      }

      if (paymentAmount > balance) {
        setError("Insufficient balance");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Send request with proper body format
      const response = await axios.post(
        `${url}/chama/deposit/${chamaId}`,
        {
          amount: amount.toString(), // Send as string to avoid floating point issues
          blockchainId: chamaBlockchainId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setTxHash(response.data.txHash);
      setShowSuccessModal(true);
    } catch (error) {
      console.log("Payment error:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        const response = await axios.get(`${url}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response) {
          setBalance(Number(response.data.balance));
        }
      } catch (error) {
        console.log("Error fetching user:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const viewOnExplorer = () => {
    Linking.openURL(`https://alfajores.celoscan.io/tx/${txHash}`);
    setShowSuccessModal(false);
  };

  const handleAmountChange = async (text: string) => {
    setAmount(text);
    if (Number(text) <= 0) {
      return;
    }
    setFetchingTxFee(true);

    // Get the tx fee for the amount
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await axios.get(`${url}/transaction`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { amount: text },
      });
      if (response) {
        setTransactionFee(Number(response.data.fee));
        setFetchingTxFee(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingTxFee(false);
    }
  };

  //function to handle the gas fee
  const formatGasFee = (gasFee: number) => {
    if (gasFee > 0.01) {
      return `${gasFee.toFixed(4)}`;
    } else if (gasFee > 0.0001) {
      return `${gasFee.toFixed(6)}`;
    } else {
      return `< 0.0001`;
    }
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          <View>
            <View style={styles.header}>
              <Image
                source={require("../assets/images/cKES.png")}
                style={styles.logo}
              />
              <Text style={styles.headerText}>Pay with cKES</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount (cKES)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={handleAmountChange}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <Text style={styles.balanceText}>
                Available balance: {balance} cKES
              </Text>

              {fetchingTxFee ? (
                <View style={styles.feeLoadingContainer}>
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.1)", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                  >
                    <Text style={styles.feeLoadingText}>
                      Calculating fee...
                    </Text>
                  </LinearGradient>
                </View>
              ) : (
                <Text style={styles.balanceText}>
                  Transaction fee:{" "}
                  {transactionFee === null ? 0 : formatGasFee(transactionFee)}{" "}
                  cKES
                </Text>
              )}

              <TouchableOpacity
                style={[styles.button, loading && styles.loadingButton]}
                onPress={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="gray" />
                    <Text style={styles.loadingButtonText}>Processing...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="paper-plane"
                      size={20}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Pay</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <SuccessModal
        amount={amount}
        chamaName={chamaName}
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onSuccess();
        }}
        viewOnExplorer={viewOnExplorer}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlay: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 8,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  balanceAmount: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  feeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  feeLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  feeAmount: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#A5E4F6",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingButton: {
    backgroundColor: background,
  },
  loadingButtonText: {
    color: "gray",
    fontWeight: "600",
    fontSize: 16,
  },
  feeLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  feeLoadingText: {
    marginLeft: 8,
    color: "#6B7280",
    fontSize: 14,
  },
  balanceText: {
    color: "black",
    fontWeight: "300",
    fontSize: 16,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CKESPay;
// // {fetchingTxFee ? (
//   <View style={styles.feeLoadingContainer}>
//   <LinearGradient
//     colors={["transparent", "rgba(0,0,0,0.1)", "transparent"]}
//     start={{ x: 0, y: 0 }}
//     end={{ x: 1, y: 0 }}
//     style={styles.gradient}
//   >
//     <Text style={styles.feeLoadingText}>Calculating fee...</Text>
//   </LinearGradient>
// </View>
// ) : (
// <Text style={styles.balanceText}>
//   Transaction fee:{" "}
//   {transactionFee === null ? 0 : formatGasFee(transactionFee)} cKES
// </Text>
// )}
