import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const DepositsHistory = () => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const deposits = [{id:1},{id:2}];

  const renderItem = ({ item }) => (
    <View style={styles.depositItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.userName}>
          {"0x45D..." || 'Loading...'}
        </Text>
        <Text style={styles.dateText}>{formatDate(Date.now())}</Text>
      </View>
      <View style={styles.amountInfo}>
        <Text style={styles.amountText}>1 cKES</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Deposits History</Text>

      {deposits.length === 0 ? (
        <View style={styles.noDeposits}>
          <Text>No deposits made.</Text>
        </View>
      ) : (
        <FlatList
          data={deposits}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#4A5568',
  },
  noDeposits: {
    alignItems: 'center',
    marginTop: 8,
  },
  depositItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  dateText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  amountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
});

export default DepositsHistory;
