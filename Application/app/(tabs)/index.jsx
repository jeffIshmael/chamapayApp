import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "react-native-elements";

import { url } from "@/constants/Endpoint";
import { duration } from "@/constants/Cycle";
import { background } from "@/constants/Colors";

const HomeScreen = () => {
  const router = useRouter();
  const [joinedChamas, setJoinedChamas] = useState([]);
  const [publicChamas, setPublicChamas] = useState([]);
  const [privateChamas, setPrivateChamas] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserChamas = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const response = await fetch(`${url}/chama/mychamas`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const results = await response.json();
        if (response.ok) {
          setJoinedChamas(results.chamas);
          setPublicChamas(
            results.chamas.filter((chama) => chama.type === "Public")
          );
          setPrivateChamas(
            results.chamas.filter((chama) => chama.type === "Private")
          );
          setUser(results.user);
        } else {
          console.log(results.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserChamas();
  }, [joinedChamas, publicChamas, privateChamas]);

  const handleChamaNavigation = (chamaId) => {
    router.push({ pathname: "/(chamatabs)/[chamaId]", params: { chamaId } });
  };

  const renderChama = ({ item, type }) => (
    <TouchableOpacity
      style={[
        styles.chamaCard,
        type === "Public" ? styles.publicCard : styles.privateCard,
      ]}
      onPress={() => handleChamaNavigation(item.id)}
    >
      <Text style={styles.chamaTitle}>{item.name}</Text>
      <Text style={styles.chamaInfo}>
        Amount: {Number(item.amount) / 10 ** 18} cKES /{" "}
        {duration(item.cycleTime)}
      </Text>
      <Text style={styles.chamaInfo}>
        Members: {item.members.length} {type === "Public" && `/ ${item.maxNo}`}{" "}
      </Text>
      <Text style={styles.chamaInfo}>
        Next Payout: {new Date(item.startDate).toDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Avatar
            size="medium"
            rounded
            title={
              user?.name
                ? user.name.slice(0, 1).toUpperCase()
                : user?.email && (user?.email).slice(0, 1).toUpperCase()
            }
            containerStyle={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Chamas</Text>

      {privateChamas.length > 0 && (
        <View>
          <Text style={styles.chamaTypeTitle}>Private Chamas</Text>
          <FlatList
            data={privateChamas}
            renderItem={({ item }) => renderChama({ item, type: "Private" })}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.chamaList}
          />
        </View>
      )}

      {publicChamas.length > 0 && (
        <View>
          <Text style={styles.chamaTypeTitle}>Public Chamas</Text>
          <FlatList
            data={publicChamas}
            renderItem={({ item }) => renderChama({ item, type: "Public" })}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.chamaList}
          />
        </View>
      )}

      {joinedChamas.length === 0 && (
        <Text style={styles.noChamasText}>
          You have not joined any chamas yet.
        </Text>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#00695C",
  },
  avatar: {
    backgroundColor: "#00897B",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004D40",
    marginBottom: 12,
  },
  chamaTypeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00796B",
    marginBottom: 10,
    marginTop: 15,
  },
  noChamasText: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
    marginTop: 20,
  },
  chamaList: {
    paddingVertical: 10,
  },
  chamaCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  publicCard: {
    borderColor: "#8BC34A",
    borderWidth: 1,
  },
  privateCard: {
    borderColor: "#FFC107",
    borderWidth: 1,
  },
  chamaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  chamaInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
