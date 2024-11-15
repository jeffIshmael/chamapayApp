import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons"  // Make sure to install and link react-native-vector-icons

const PaymentsList = () => {
//   const openTransactionLink = (txHash) => {
//     const url = `https://celoscan.io/tx/${txHash}`;
//     Linking.openURL(url).catch((err) => console.error("Couldn't open URL", err));
//   };

  const renderPayment = () => (
    <View style={styles.paymentContainer} >
      {/* Payment Details */}
      <View style={styles.paymentDetails}>
        <View style={styles.iconContainer}>
          <Ionicons name="filter-outline" size={24} color="white" />
        </View>
        <View>
          <Text style={styles.paymentTitle}>
            Payment to 
          </Text>
          <Text style={styles.paymentDate}>
            {new Date(Date.now()).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Payment Amount */}
      <Text style={styles.paymentAmount}> cKES</Text>

      {/* Transaction Link */}
      <TouchableOpacity >
        <Ionicons name="return-down-forward-outline" size={24} color="#3ABAB4" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      renderItem={renderPayment}
      keyExtractor={(item) => item.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#E0F4F1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#37B7AD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  paymentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#37B7AD',
    padding: 8,
    borderRadius: 50,
    marginRight: 8,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3ABAB4',
  },
});

export default PaymentsList;
