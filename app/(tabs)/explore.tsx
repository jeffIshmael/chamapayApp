import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const ExploreScreen = () => {
  // const [publicChamas, setPublicChamas] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchPublicChamas();
  // }, []);

  // const fetchPublicChamas = async () => {
  //   setLoading(true);
  //   try {
  //     const chamas = await getPublicChamas();
  //     setPublicChamas(chamas);
  //   } catch (error) {
  //     console.error("Error fetching public chamas:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleJoinChama = async (chamaId) => {
  //   try {
  //     await requestJoinChama(chamaId);
  //     toast.success("Join request sent!");
  //   } catch (error) {
  //     toast.error("Failed to send join request.");
  //     console.error(error);
  //   }
  // };

  const renderChama = () => (
    <View style={styles.chamaCard}>
      <Text style={styles.chamaTitle}>name</Text>
      <Text style={styles.chamaInfo}>Participants: </Text>
      <Text style={styles.chamaInfo}>Creator: </Text>
      <TouchableOpacity
        style={styles.joinButton}
        // onPress={() => handleJoinChama(item.id)}
      >
        <Text style={styles.joinButtonText}>Join Chama</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Chamas</Text>
      
        <FlatList
          data={["random","forever", "to"]}
          renderItem={renderChama}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.chamaList}
        />

    </View>
  );
};

export default ExploreScreen;

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
  joinButton: {
    marginTop: 10,
    backgroundColor: '#32a852',
    paddingVertical: 8,
    borderRadius: 5,
  },
  joinButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
