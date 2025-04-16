import { duration } from "@/constants/Cycle";
import { url } from "@/constants/Endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import Lock from "@/components/Lock";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { imageMap } from "@/constants/Images";

interface Member {
  user: string;
  address: string;
}

interface Chama {
  adminId: number;
  amount: number;
  createdAt: string;
  cycleTime: number;
  id: number;
  maxNo: number;
  members: Member[];
  name: string;
  blockchainId: number;
  payDate: string;
  slug: string;
  startDate: string;
  started: boolean;
  type: string;
}

const ExploreScreen = () => {
  const [publicChamas, setPublicChamas] = useState<Chama[]>([]);
  const [tab, setTab] = useState<"Started" | "Not Started">("Started");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedChama, setSelectedChama] = useState<Chama | null>(null);
  const [buttonText, setButtonText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const fetchChamas = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${url}/chama/chamas`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const results = await response.json();
      if (response.ok) setPublicChamas(results.chamas);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChamas();
  }, []);

  const filteredChamas = publicChamas?.filter((chama) =>
    tab === "Started" ? chama.started : !chama.started
  );

  const handleRefresh = async () => {
    await fetchChamas();
  };

  const handlePayment = async (
    amount: string,
    chamaId: number,
    chamaName: string
  ) => {
    try {
      setIsProcessing(true);
      setErrorMessage("");
      setButtonText("Locking...");

      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${url}/chama/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          chamaId,
          blockchainId: selectedChama?.blockchainId,
          creation: false,
        }),
      });

      const results = await response.json();
      if (response.ok) {
        Alert.alert(
          "Success",
          `✨ Congratulations ✨\n\nYou've successfully joined ${chamaName}!`,
          [{ text: "OK", onPress: () => handleChamaNavigation(chamaId) }]
        );
      } else {
        setErrorMessage(results.message || "Failed to join chama");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChamaNavigation = (chamaId: number) => {
    router.push({ pathname: "/(chamatabs)/[chamaId]", params: { chamaId } });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="sad-outline" size={48} color="#90a4ae" />
      <Text style={styles.emptyText}>
        {tab === "Started"
          ? "No active chamas available"
          : "No upcoming chamas found"}
      </Text>
      <Text style={styles.emptySubtext}>
        Check back later or create your own chama
      </Text>
    </View>
  );

  const renderChama = ({ item }: { item: Chama }) => (
    <View style={styles.chamaCard}>
      <View style={styles.chamaHeader}>
        <Image
          source={
            imageMap[item.id.toString()] ||
            require("@/assets/images/default.png")
          }
          style={styles.chamaImage}
        />
        <View style={styles.chamaStatus}>
          <View
            style={[
              styles.statusIndicator,
              item.started ? styles.started : styles.notStarted,
            ]}
          >
            <Text style={styles.statusText}>
              {item.started ? "Active" : "Upcoming"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chamaContent}>
        <Text style={styles.chamaTitle}>{item.name}</Text>

        <View style={styles.chamaInfoRow}>
          <Ionicons name="cash-outline" size={16} color="#4a6572" />
          <Text style={styles.chamaInfo}>
            {Number(item.amount) / 10 ** 18} cKES / {duration(item.cycleTime)}
          </Text>
        </View>

        <View style={styles.chamaInfoRow}>
          <Ionicons name="people-outline" size={16} color="#4a6572" />
          <Text style={styles.chamaInfo}>
            {item.members.length}/{item.maxNo} members
          </Text>
        </View>

        <View style={styles.chamaInfoRow}>
          <Ionicons
            name={item.started ? "calendar-outline" : "time-outline"}
            size={16}
            color="#4a6572"
          />
          <Text style={styles.chamaInfo}>
            {item.started
              ? `Next payout: ${new Date(item.payDate).toLocaleString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`
              : `Starts: ${new Date(item.startDate).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => {
            setSelectedChama(item);
            setModalOpen(true);
          }}
        >
          <LinearGradient
            colors={["#4ca99f", "#4ca99f"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.joinButtonText}>Join Chama</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#e0f7fa", "#b2ebf2"]} style={styles.header}>
        <Text style={styles.title}>Explore Chamas</Text>
        <Text style={styles.subtitle}>
          Discover and join community savings groups
        </Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "Started" && styles.activeTab]}
          onPress={() => setTab("Started")}
        >
          <Text
            style={[styles.tabText, tab === "Started" && styles.activeTabText]}
          >
            Active Chamas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "Not Started" && styles.activeTab]}
          onPress={() => setTab("Not Started")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "Not Started" && styles.activeTabText,
            ]}
          >
            Upcoming Chamas
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredChamas}
        renderItem={renderChama}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chamaList}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#32a852"]}
            tintColor="#32a852"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <Lock
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedChama(null);
        }}
        onProceed={() =>
          handlePayment(
            (Number(selectedChama?.amount) / 10 ** 18).toString() || "0",
            selectedChama?.id || 0,
            selectedChama?.name || ""
          )
        }
        loading={isProcessing}
        errText={errorMessage}
        buttonText={buttonText}
        amount={Number(selectedChama?.amount) / 10 ** 18 || 0}
        name={selectedChama?.name || ""}
        creation={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#005b4f",
    // marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#00796b",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#99d9d3",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a6572",
  },
  activeTabText: {
    color: "#00796b",
  },
  chamaList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  chamaCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  chamaHeader: {
    position: "relative",
  },
  chamaImage: {
    width: "100%",
    height: 160,
  },
  chamaStatus: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  started: {
    backgroundColor: "rgba(76, 175, 80, 0.9)",
  },
  notStarted: {
    backgroundColor: "rgba(255, 193, 7, 0.9)",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  chamaContent: {
    padding: 16,
  },
  chamaTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#263238",
    marginBottom: 12,
  },
  chamaInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  chamaInfo: {
    fontSize: 14,
    color: "#4a6572",
    marginLeft: 8,
  },
  joinButton: {
    marginTop: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  joinButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#546e7a",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#90a4ae",
    marginTop: 8,
    textAlign: "center",
  },
});

export default ExploreScreen;
