import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const Lock = ({ visible, onClose, onProceed, loading, processing, amount, name }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        {/* Modal Content */}
        <Text style={styles.title}>Lock Amount</Text>
        <Text style={styles.description}>
          You need to lock the required {amount} cKES before joining {name} public chama.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Cancel Button */}
          <TouchableOpacity
            onPress={loading || processing ? undefined : onClose}
            disabled={loading || processing}
            style={[
              styles.button,
              styles.cancelButton,
              loading || processing && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          {/* Proceed Button */}
          <TouchableOpacity
            onPress={onProceed}
            disabled={loading || processing}
            style={[
              styles.button,
              styles.proceedButton,
              loading || processing && styles.disabledButton,
            ]}
          >
            {loading || processing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Proceed</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 50,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  proceedButton: {
    backgroundColor: '#4caf50',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Lock;