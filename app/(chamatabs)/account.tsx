import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard, Image } from 'react-native';
import { ToastAndroid } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Customize icons with a package like react-native-vector-icons


import Payment from "@/components/Payment";
import WalletScreen from '../(tabs)/wallet';
export default function Wallet(){
  const [visible, setVisible] = useState(true);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  // const copyToClipboard = () => {
  //   Clipboard.setString(myAddress);
  //   ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  // };

  return (
    <WalletScreen />
  );
};



