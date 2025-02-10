import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

const PasswordScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Change Password</Text>

      {/* Current Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your current password"
          secureTextEntry
        />
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your new password"
          secureTextEntry
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Confirm your new password"
          secureTextEntry
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={() => {}}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default PasswordScreen;