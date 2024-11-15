import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CreateFamily from '@/components/CreateFamily';
import CreatePublic from '@/components/CreatePublic';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateScreen = () => {
  const [familyForm, setFamilyForm] = useState(true);
  const [activeSection, setActiveSection] = useState('Create');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Chama</Text>
      
      {/* Toggle between Family & Friends and Public */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setFamilyForm(true)}
          style={[styles.toggleButton, familyForm ? styles.activeButton : styles.inactiveButton]}
        >
          <Text style={[styles.toggleButtonText, familyForm ? styles.activeText : styles.inactiveText]}>
            Family & Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFamilyForm(false)}
          style={[styles.toggleButton, !familyForm ? styles.activeButton : styles.inactiveButton]}
        >
          <Text style={[styles.toggleButtonText, !familyForm ? styles.activeText : styles.inactiveText]}>
            Public
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render the appropriate form */}
      {familyForm ? <CreateFamily /> : <CreatePublic />}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7F9', // downy-100 equivalent
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    marginStart: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB', // gray-200 equivalent
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#63C5DA', // downy-500 equivalent
  },
  inactiveButton: {
    backgroundColor: '#E5E7EB', // gray-200 equivalent
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#FFF',
  },
  inactiveText: {
    color: '#333',
  },
});

export default CreateScreen;
