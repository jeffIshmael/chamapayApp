import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";

import CKESPay from "./CKESPay";
import MPesaPay from "./MPesaPay";

const PaymentModal = ({
  visible,
  onClose,
  chamaId,
  chamaName,
  blockchainId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showcKESPay, setShowcKESPay] = useState(false);
  const [showMPesaPay, setShowMPesaPay] = useState(false);

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setPaymentMethod("");
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backgroundOverlay} onPress={onClose} />
        <View>
          {!paymentMethod ? (
            <>
              <View style={styles.modalContainer}>
                <Text style={styles.title}>Pay with:</Text>
                <View style={styles.paymentOptionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handlePaymentMethod("ckes");
                      setShowcKESPay(true);
                    }}
                    style={styles.paymentOption}
                  >
                    <View style={styles.paymentContent}>
                      <Image
                        source={require("../assets/images/cKES.png")}
                        style={styles.paymentIcon}
                      />
                      <Text style={styles.paymentText}>cKES</Text>
                    </View>
                    <Text style={styles.arrow}>➔</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handlePaymentMethod("mpesa")}
                    style={styles.paymentOption}
                  >
                    <View style={styles.paymentContent}>
                      <Image
                        source={require("../assets/images/mpesa.png")}
                        style={styles.paymentIcon}
                      />
                      <Text style={styles.paymentText}>M-Pesa</Text>
                    </View>
                    <Text style={styles.arrow}>➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : paymentMethod === "mpesa" ? (
            <MPesaPay /> // MPesaPay component
          ) : (
            <CKESPay
              visible={showcKESPay}
              onClose={() => {
                setPaymentMethod("");
                setShowcKESPay(false);
              }}
              onSuccess={onClose}
              chamaId={chamaId}
              chamaBlockchainId={blockchainId}
              chamaName={chamaName}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    paddingBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  paymentOptionContainer: {
    width: "100%",
    alignItems: "center",
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    width: "100%",
    marginVertical: 8,
  },
  paymentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 24,
    color: "#6B7280",
  },
});

export default PaymentModal;
