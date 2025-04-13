import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CreateFamily from '@/components/CreateFamily';
import CreatePublic from '@/components/CreatePublic';
import { SafeAreaView } from 'react-native-safe-area-context';
import {background} from "@/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const CreateScreen = () => {
  const [familyForm, setFamilyForm] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3ABAB4', '#E0F7F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="people-circle" size={32} color="#fff" />
          <Text style={styles.title}>Create New Chama</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Toggle between Family & Friends and Public */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setFamilyForm(true)}
            style={[
              styles.toggleButton, 
              styles.toggleLeft,
              familyForm ? styles.activeButton : styles.inactiveButton
            ]}
          >
            <Ionicons 
              name="people" 
              size={20} 
              color={familyForm ? '#fff' : '#3ABAB4'} 
              style={styles.toggleIcon}
            />
            <Text style={[
              styles.toggleButtonText, 
              familyForm ? styles.activeText : styles.inactiveText
            ]}>
              Family & Friends
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setFamilyForm(false)}
            style={[
              styles.toggleButton, 
              styles.toggleRight,
              !familyForm ? styles.activeButton : styles.inactiveButton
            ]}
          >
            <Ionicons 
              name="globe" 
              size={20} 
              color={!familyForm ? '#fff' : '#3ABAB4'} 
              style={styles.toggleIcon}
            />
            <Text style={[
              styles.toggleButtonText, 
              !familyForm ? styles.activeText : styles.inactiveText
            ]}>
              Public
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the appropriate form */}
        <View style={styles.formWrapper}>
          {familyForm ? <CreateFamily /> : <CreatePublic />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#3ABAB4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  toggleLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  toggleRight: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  activeButton: {
    backgroundColor: '#3ABAB4',
  },
  inactiveButton: {
    backgroundColor: '#fff',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#3ABAB4',
  },
  toggleIcon: {
    marginRight: 8,
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#3ABAB4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default CreateScreen;