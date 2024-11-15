import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard, Image } from 'react-native';
import { ToastAndroid } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Customize icons with a package like react-native-vector-icons


import Payment from "@/components/Payment"
export default function WalletScreen(){
  const [visible, setVisible] = useState(true);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  // const copyToClipboard = () => {
  //   Clipboard.setString(myAddress);
  //   ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // disconnect();
            ToastAndroid.show("Disconnected!", ToastAndroid.SHORT);
          }}
          style={styles.disconnectButton}
        >
          <Ionicons name="exit-outline" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Balance</Text>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            cKES
          </Text>
          <TouchableOpacity onPress={toggleVisible} style={styles.iconButton}>
            <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.addressContainer}>
          
            <TouchableOpacity style={styles.addressButton}>
              <Text style={styles.addressText}>myAddress</Text>
              <Ionicons name="copy-outline" size={20} color="white" />
            </TouchableOpacity>
        
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.action}>
          <Ionicons name="download-outline" size={24} color="white" />
            <Text style={styles.actionText}>Deposit</Text>
          </View>
          <View style={styles.action}>
          <Ionicons name="arrow-up-circle-outline" size={24} color="white" />
            <Text style={styles.actionText}>Withdraw</Text>
          </View>
          <View style={styles.action}>
          <Ionicons name="arrow-redo-outline" size={24} color="white" />
            <Text style={styles.actionText}>Send</Text>
          </View>
          <View style={styles.action}>
            <Ionicons name="qr-code-outline" size={24} color="white" />
            <Text style={styles.actionText}>QR Code</Text>
          </View>
        </View>
      </View>
      <Payment />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F4F1', // Equivalent of bg-downy-100
   
  },
  header: {
    backgroundColor: '#3ABAB4', // Equivalent of bg-downy-600
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  disconnectButton: {
    alignSelf: 'flex-end',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  balanceText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  iconButton: {
    marginLeft: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#37B7AD', // Equivalent of bg-downy-500
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    color: 'white',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 40,
  },
  action: {
    alignItems: 'center',
  },
  actionImage: {
    width: 24,
    height: 24,
  },
  actionText: {
    marginTop: 5,
    color: 'white',
    fontSize: 12,
  },
});

