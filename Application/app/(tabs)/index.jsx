import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserChamas = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getUserChamas().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserChamas();
    setRefreshing(false);
  };

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
        Members: {item.members.length} {type === "Public" && `/ ${item.maxNo}`}
      </Text>
      <Text style={styles.chamaInfo}>
        {item.started
          ? `Next Payout: ${new Date(item.payDate).toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : `Start Date: ${new Date(item.startDate).toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}`}
      </Text>
    </TouchableOpacity>
  );

  const renderSection = (title, data, type) =>
    data.length > 0 && (
      <View>
        <Text style={styles.chamaTypeTitle}>{title}</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => renderChama({ item, type })}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.chamaList}
          scrollEnabled={false}
        />
      </View>
    );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Avatar
            size="medium"
            rounded
            title={
              user?.name
                ? user.name.slice(0, 1).toUpperCase()
                : user?.email?.slice(0, 1).toUpperCase()
            }
            containerStyle={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Chamas</Text>

      {renderSection("Private Chamas", privateChamas, "Private")}
      {renderSection("Public Chamas", publicChamas, "Public")}

      {!loading && joinedChamas.length === 0 && (
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
    backgroundColor: "#E6FFFF", // lightest teal background
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#00695C",
  },
  avatar: {
    backgroundColor: "#33A89E", // lighter avatar background
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004D40",
    marginBottom: 4,
  },
  chamaTypeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00796B",
    marginBottom: 4,
    marginTop: 10,
  },
  noChamasText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
  chamaList: {
    paddingVertical: 4,
  },
  chamaCard: {
    padding: 18,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCF9F6", // soft border color
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  publicCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#8BC34A", // green accent
  },
  privateCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#FFC107", // yellow accent
  },
  chamaTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
  chamaInfo: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
});
