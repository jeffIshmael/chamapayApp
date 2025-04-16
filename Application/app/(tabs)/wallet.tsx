import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ToastAndroid } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"; // Customize icons with a package like react-native-vector-icons
import AsyncStorage from "@react-native-async-storage/async-storage";
import Payment from "@/components/Payment";
import { url } from "@/constants/Endpoint";
import QR from "@/components/qr";

interface UserTx {
  value: string;
  blockHash: string;
  blockNumber: string;
  contractAddress: string;
  from: string;
  hash: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
}
interface User {
  address: string;
  balance: string;
  email: string;
  id: number;
  name: string;
  password: string;
  phoneNo: number;
  role: string;
  userTxs: UserTx[];
}

export default function WalletScreen() {
  const [visible, setVisible] = useState(true);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const getUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        setLoading(false); // Stop loading if no token is found
        return;
      }

      const response = await fetch(`${url}/user`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const Details = await response.json();
      // console.log(Details);

      if (response.ok) {
        setUserDetails(Details);
      } else {
        console.log("Error fetching user details:", Details.message);
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    } finally {
      setLoading(false); // Ensure loading stops after fetch completes
    }
  };

  useEffect(() => {
    setLoading(true);
    getUserDetails().finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getUserDetails();
    setRefreshing(false);
  };

  const copyToClipboard = (myAddress: string | undefined) => {
    if (myAddress) {
      Clipboard.setString(myAddress);
      // ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#3ABAB4"
          style={styles.loading}
        />
      </View>
    );
  }

  // Render error state if userDetails is null after loading
  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load wallet details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Balance</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            {visible ? Number(userDetails?.balance).toFixed(2) : "***"} cKES
          </Text>
          <TouchableOpacity onPress={toggleVisible} style={styles.iconButton}>
            <Ionicons
              name={visible ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.addressContainer}>
          <TouchableOpacity
            style={styles.addressButton}
            onPress={() => copyToClipboard(userDetails?.address)}
          >
            <Text style={styles.addressText}>
              {`${userDetails?.address?.slice(
                0,
                6
              )}...${userDetails?.address?.slice(-4)}`}
            </Text>
            <Ionicons name="copy-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => router.push("/deposit")}>
            <View style={styles.action}>
              <Ionicons name="download-outline" size={24} color="white" />
              <Text style={styles.actionText}>Deposit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/withdraw")}>
            <View style={styles.action}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={24}
                color="white"
              />
              <Text style={styles.actionText}>Withdraw</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/send")}>
            <View style={styles.action}>
              <Ionicons name="arrow-redo-outline" size={24} color="white" />
              <Text style={styles.actionText}>Send</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setQrVisible(true)}>
            <View style={styles.action}>
              <Ionicons name="qr-code-outline" size={24} color="white" />
              <Text style={styles.actionText}>QR Code</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Payment
        payments={userDetails?.userTxs}
        userAddress={userDetails?.address}
        refresh={handleRefresh}
        refreshing={refreshing}
      />
      {qrVisible && (
        <QR
          walletAddress={userDetails?.address}
          visible={qrVisible}
          onClose={() => setQrVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F4F1", // Equivalent of bg-downy-100
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
  header: {
    backgroundColor: "#3ABAB4", // Equivalent of bg-downy-600
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  disconnectButton: {
    alignSelf: "flex-end",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  balanceText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginRight: 2,
  },
  iconButton: {
    marginLeft: 10,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#37B7AD",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addressButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    color: "white",
    fontSize: 14,
    marginRight: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 40,
  },
  action: {
    alignItems: "center",
  },
  actionImage: {
    width: 24,
    height: 24,
  },
  actionText: {
    marginTop: 5,
    color: "white",
    fontSize: 12,
  },
});
