import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CKESPay = ({ id, name, balance }:{id:number, name:string, balance:number}) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    setLoading(true);
    // Insert payment handling logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/cKES.png')} style={styles.logo} />
        <Text style={styles.headerText}>cKES Pay</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount (cKES)</Text>
          <TextInput
            style={styles.input}
            placeholder="Input amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <Text style={styles.balanceText}>
          Available balance: {balance} cKES
        </Text>
        <TouchableOpacity
          style={[styles.button, loading ? styles.loadingButton : styles.activeButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Processing..." : "Pay"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  balanceText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#4ADE80', // Example color for active state
  },
  loadingButton: {
    backgroundColor: '#D1FAE5', // Example color for loading state
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CKESPay;
