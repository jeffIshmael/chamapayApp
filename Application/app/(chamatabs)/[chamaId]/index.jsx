import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentModal from "@/components/Pay";
import Ionicons from "@expo/vector-icons/Ionicons";

import { url } from "@/constants/Endpoint";
import { duration } from "@/constants/Cycle";
import { useChamaId } from "../../context/ChamaContext";
import Lock from "@/components/Lock";

const Details = () => {
  const [started, setStarted] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openLockModal, setOpenLockModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [included, setIncluded] = useState(true);
  const [chama, setChama] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Add loading state
  const chamaId = useChamaId();
  const router = useRouter();

  useEffect(() => {
    if (!chamaId) {
      console.error("chamaId is undefined");
      setLoading(false); // Stop loading if no chamaId is provided
      return;
    }
    const fetchChama = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          setLoading(false); // Stop loading if no token is found
          return;
        }

        const response = await fetch(`${url}/chama/${chamaId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const results = await response.json();

        if (response.ok) {
          setChama(results.chama);
          setIncluded(results.isMember);
        } else {
          console.log("Error fetching chama details:", results.message);
        }
      } catch (error) {
        console.log("Error fetching chama details:", error);
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    };
    fetchChama();
  }, [chamaId]);

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  // function to handle locking to join public chama
  const handleLock = async (amount, chamaId, chamaName) => {
    setErrorText("");
    try {
      setIsProcessing(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      setButtonText(`Locking ...`);
      const response = await fetch(`${url}/chama/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          chamaId: chamaId,
          blockchainId: chama.blockchainId || 0,
          creation: false,
        }),
      });
      const results = await response.json();
      // console.log(results);
      if (response.ok) {
        //return the txHash
        Alert.alert(
          "Success",
          `✨ Congratulations.✨\n\nYou've successfully joined ${chamaName}!`,
          [{ text: "OK" }]
        );
      } else {
        setErrorText(results.message || "Failed to create chama");
      }
    } catch (error) {
      console.log(error);
      setErrorText("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    // Render a loading indicator while data is being fetched
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#00796B"
          style={styles.loading}
        />
      </View>
    );
  }

  if (!chama) {
    // Handle case where chama data is unavailable
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chama details not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.statusContainer}>
        {chama.started ? (
          <View style={styles.status}>
            <View style={styles.statusCircleStarted} />
            <Text>Started</Text>
          </View>
        ) : (
          <View style={styles.status}>
            <View style={styles.statusCircleNotStarted} />
            <Text>Not Started</Text>
          </View>
        )}
      </View>

      <View style={styles.chamaCard}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `https://ipfs.io/ipfs/Qmd1VFua3zc65LT93Sv81VVu6BGa2QEuAakAFJexmRDGtX/${chama.id.toString()}.jpg`,
            }}
            style={styles.image}
          />
        </View>

        {/* Chama Details */}
        <Text style={styles.chamaTitle}>{chama.name}</Text>
        <Text style={styles.chamaAmount}>
          {Number(chama.amount) / 10 ** 18} cKES/{duration(chama.cycleTime)}
        </Text>
        <Text style={styles.chamaMembers}>
          {(chama.members || []).length}{" "}
          {chama.type === "Public" && ` / ${chama.maxNo}`} Members
        </Text>
        <Text style={styles.chamaDate}>
          {chama.started
            ? `PayDate: ${new Date(chama.payDate).toDateString()}`
            : `StartDate: ${new Date(chama.startDate).toDateString()}`}
        </Text>

        {/* Pay Button */}
        <View style={styles.buttonContainer}>
          {!included ? (
            <TouchableOpacity
              onPress={() => setOpenLockModal(true)}
              style={styles.joinButton}
            >
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => setOpenModal(true)}
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SVG/Icon */}
        {included && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              router.push("/(chamatabs)/[chamaId]/chat");
            }}
          >
            <Ionicons name="chatbubbles-outline" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Payment Modal */}
      {openModal && (
        <PaymentModal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          chamaId={chamaId}
          chamaName={chama.name}
          blockchainId={chama.blockchainId}
        />
      )}

      {/* Lock Modal to join public chama*/}
      {
        <Lock
          visible={openLockModal}
          onClose={() => {
            setOpenLockModal(false);
          }}
          onProceed={() =>
            handleLock(
              (Number(chama?.amount) / 10 ** 18).toString() || "0",
              chama?.id || 0,
              chama?.name || ""
            )
          }
          loading={isProcessing}
          errText={errorText}
          buttonText={buttonText}
          amount={Number(chama?.amount) / 10 ** 18 || 0}
          name={chama?.name || ""}
          creation={false}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    padding: 20,
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCircleStarted: {
    width: 12,
    height: 12,
    backgroundColor: "green",
    borderRadius: 6,
    marginRight: 8,
  },
  statusCircleNotStarted: {
    width: 12,
    height: 12,
    backgroundColor: "gray",
    borderRadius: 6,
    marginRight: 8,
  },
  chamaCard: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    padding: 16,
    width: "100%",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  chamaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  chamaAmount: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  chamaMembers: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  chamaDate: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  payButton: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: "#00796B",
  },
});

export default Details;
