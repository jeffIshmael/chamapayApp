import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Icon } from "react-native-elements";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { url } from "@/constants/Endpoint";
import {background} from "@/constants/Colors";

const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("Loading...");
  const [passPhrase, setPassPhrase] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        const response = await axios.get(`${url}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(response.data.name || "No Username");
        setEmail(response.data.email || "No Email");
        setPhone(response.data.phone || "e.g +2547123..");
        setPassPhrase(response.data.mnemonics);
      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.error("Image Picker Error: ", response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0].uri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <View>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <Avatar
              size={100}
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              containerStyle={styles.avatarPlaceholder}
            />
          )}
          <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
            <Icon name="edit" type="material" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#3ABAB4" />
      ) : (
        <View style={styles.detailsContainer}>
          {[
            { label: "Username", value: name, setValue: setName },
            { label: "Email", value: email, setValue: setEmail },
            { label: "Phone", value: phone, setValue: setPhone },
          ].map((field) => (
            <View key={field.label} style={styles.detailItem}>
              <Text style={styles.label}>{field.label}</Text>
              {editingField === field.label ? (
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setValue}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                />
              ) : (
                <View style={styles.detailRow}>
                  <Text style={styles.detailText}>{field.value}</Text>
                  <TouchableOpacity onPress={() => setEditingField(field.label)}>
                    <Icon name="edit" type="material" size={18} color="#3ABAB4" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Other Sections */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionItem}
          onPress={() => router.push({ pathname: "/passphrase", params: { passPhrase } })}
        >
          <Text style={styles.sectionText}>Recovery Passphrase</Text>
          <Icon name="chevron-right" type="material" size={20} color="#3ABAB4" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sectionItem}
          onPress={() => router.push("/password")}
        >
          <Text style={styles.sectionText}>Change Password</Text>
          <Icon name="chevron-right" type="material" size={20} color="#3ABAB4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem}>
          <Text style={styles.sectionText}>About</Text>
          <Icon name="chevron-right" type="material" size={20} color="#3ABAB4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    alignItems: "center",
    paddingTop: 50,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#3ABAB4",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3ABAB4",
    borderRadius: 50,
    padding: 5,
  },
  detailsContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  sectionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

export default ProfileScreen;
