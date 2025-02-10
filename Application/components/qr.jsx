import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg"; // Ensure this package is installed

const QR = ({ walletAddress, visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backgroundOverlay} onPress={onClose} />
        
        <View style={styles.qrContainer}>
          {/* QR Code */}
          <View style={styles.qrCodeWrapper}>
            <QRCode value={walletAddress} size={180} backgroundColor="white" color="#008080" />
          </View>


          {/* Wallet Address Section */}
          <View style={styles.walletAddressContainer}>
            <TouchableOpacity style={styles.walletAddressButton}>
              <Text style={styles.walletAddressText}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Text>
              <Ionicons name="copy" size={22} color="black" />
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },  
  qrContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    alignItems: "center",
    width: "85%",
  },
  qrCodeWrapper: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#008080",
  },
  walletAddressContainer: {
    marginTop: 10,
  },
  walletAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 8,
  },
  walletAddressText: {
    fontSize: 16,
    color: "#333",
    marginRight: 6,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#008080",
    borderRadius: 6,
  },
  closeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default QR;
