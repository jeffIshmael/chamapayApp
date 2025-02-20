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
} from "react-native";

import Lock from "@/components/Lock";
import { isLoading } from "expo-font";

interface Chama {
  adminId: number;
  amount: number;
  createdAt: string;
  cycleTime: number;
  id: number;
  maxNo: number;
  members: [];
  name: string;
  payDate: string;
  slug: string;
  startDate: string;
  started: boolean;
  type: string;
}

const ExploreScreen = () => {
  const [publicChamas, setPublicChamas] = useState<Chama[]>([]);
  const [tab, setTab] = useState("Started"); // Tab state: "Started" or "Not Started"
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedChama, setSelectedChama] = useState<Chama | null>(null);

  useEffect(() => {
    const getPublicChamas = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const response = await fetch(`${url}/mychamas`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const results = await response.json();
        if (response.ok) {
          setPublicChamas(
            results.filter((chama: Chama) => chama.type === "Public")
          );
        } else {
          console.log(results.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPublicChamas();
  }, []);

  const filteredChamas = publicChamas.filter((chama) =>
    tab === "Started" ? chama.started : !chama.started
  );

  const handlePayment = () => {
    console.log("done");
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {tab === "Started" ? "No started chamas found." : "Not available."}
      </Text>
      <Image
        source={{
          uri: "https://via.placeholder.com/200x150.png?text=No+Chamas",
        }}
        style={styles.emptyImage}
      />
    </View>
  );

  const renderChama = ({ item }: { item: Chama }) => (
    <View style={styles.chamaCard}>
      <Image
        source={{
          uri: `https://ipfs.io/ipfs/Qmd1VFua3zc65LT93Sv81VVu6BGa2QEuAakAFJexmRDGtX/${item.id}.jpg`,
        }}
        style={styles.chamaImage}
      />
      <View style={styles.chamaDetails}>
        <Text style={styles.chamaTitle}>{item.name}</Text>
        <Text style={styles.chamaInfo}>
          {item.amount} cKES / {duration(item.cycleTime)}
        </Text>
        <Text style={styles.chamaInfo}>
          Participants: {item.members.length} / {item.maxNo}
        </Text>
        <Text style={styles.chamaInfo}>
          {item.started
            ? `Next Payout: ${new Date(item.payDate).toDateString()}`
            : `Start Date: ${new Date(item.startDate).toDateString()}`}
        </Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => {
            setSelectedChama(item);
            console.log(item.id);
            setModalOpen(true);
          }}
        >
          <Text style={styles.joinButtonText}>Join Chama</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Chamas</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "Started" && styles.activeTab]}
          onPress={() => setTab("Started")}
        >
          <Text
            style={[styles.tabText, tab === "Started" && styles.activeTabText]}
          >
            Started
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
            Not Started
          </Text>
        </TouchableOpacity>
      </View>
      {filteredChamas.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredChamas}
          renderItem={renderChama}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.chamaList}
        />
      )}
      {
        <Lock
          visible={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedChama(null);
          }}
          onProceed={handlePayment}
          loading={isLoading}
          processing={isProcessing}
          amount={selectedChama?.amount || 0}
          name={selectedChama?.name || ""}
        />
      }
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#32a852",
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  chamaList: {
    paddingBottom: 10,
  },
  chamaCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  chamaImage: {
    width: 100,
    height: 100,
  },
  chamaDetails: {
    flex: 1,
    padding: 10,
  },
  chamaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  chamaInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  joinButton: {
    marginTop: 10,
    backgroundColor: "#32a852",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  emptyImage: {
    width: 200,
    height: 150,
  },
});
