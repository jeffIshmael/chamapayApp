import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg'; // Ensure this package is installed

const DepositQr = ({ walletAddress }) => {
  return (
    <View style={styles.qrContainer}>
      <Text style={styles.qrHeader}>ChamaPay</Text>
      <Text style={styles.qrInstruction}>Make sure you are using the Celo network</Text>
      
      <View style={styles.qrCodeWrapper}>
        <QRCode value={walletAddress} size={180} backgroundColor="white" color="#008080" />
      </View>
      
      <View style={styles.walletAddressContainer}>
        <TouchableOpacity style={styles.walletAddressButton}>
          <Text style={styles.walletAddressText}>
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </Text>
          <Ionicons name="copy" size={22} color="black" style={styles.copyIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  qrHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#008080',
  },
  qrInstruction: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  qrCodeWrapper: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#008080',
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  walletAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 8,
  },
  walletAddressText: {
    fontSize: 16,
    color: '#333',
    marginRight: 6,
    fontWeight: 'bold',
  },
  copyIcon: {
    marginLeft: 5,
  },
};

export default DepositQr;
