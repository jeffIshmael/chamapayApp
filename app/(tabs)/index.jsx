import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  // Sample data for testing purposes
  const joinedChamas = [
    { id: 1, name: 'Chama 1', participantsCount: 5, nextPayout: '2024-12-01' },
    { id: 2, name: 'Chama 2', participantsCount: 3, nextPayout: '2024-11-15' },
    { id: 3, name: 'Chama 3', participantsCount: 7, nextPayout: '2024-11-20' },
    // Add more items as needed
  ];
  const router = useRouter();

  // Function to handle dynamic navigation
  const handleChamaNavigation = (chamaId) => {
    router.push({
      pathname: '(chamatabs)',
      params: { chamaId }, // Pass any parameters if needed
    });
  };

  const renderChama = ({ item }) => (
    <TouchableOpacity
      style={styles.chamaCard}
      onPress={() => {handleChamaNavigation(item.id)}}
    >
      <Text style={styles.chamaTitle}>{item.name}</Text>
      <Text style={styles.chamaInfo}>Participants: {item.participantsCount}</Text>
      <Text style={styles.chamaInfo}>Next payout: {item.nextPayout}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Chamas</Text>

      <FlatList
        data={joinedChamas}
        renderItem={renderChama}
        keyExtractor={(item) => item.id.toString()} // Ensure to use a unique key for each item
        contentContainerStyle={styles.chamaList}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
  },
  noChamasText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
  chamaList: {
    paddingVertical: 10,
  },
  chamaCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  chamaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  chamaInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
