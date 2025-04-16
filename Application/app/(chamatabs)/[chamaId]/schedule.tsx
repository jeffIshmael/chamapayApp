import React, { Suspense, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle, Text as SvgText } from "react-native-svg"; // Import SVG components

import { useChamaId } from "@/app/context/ChamaContext";
import { url } from "@/constants/Endpoint";
import DepositsHistory from "@/components/Deposit";
import PayoutsHistory from "@/components/Payout";
import { formatTimeRemaining } from "@/constants/Cycle";
import { background } from "@/constants/Colors";

// Constants for the circle
const screenWidth = Dimensions.get("window").width;
const circleRadius = 100; // Radius of the circle
const strokeColor = "#66d9d0"; // Color of the progress bar
const trackColor = "#E0F7FA"; // Background color of the circle

interface User {
  id: number;
  name: string;
  address: string;
  role: string;
}

interface Payout{
  amount:string;
  chamaId: number;
  doneAt: Date;
  user: {
    name: string;
    address: string;
  }
}

interface Chama {
  id: number;
  name: string;
  slug: string;
  type: string;
  startDate: string;
  payDate: string;
  cycleTime: number;
  started: boolean;
  amount: number;
  maxNo: number;
  adminId: number;
  createdAt: string;
  members: User[];
  payOuts: Payout[]
}

const ScheduleScreen = () => {
  const [showDeposit, setShowDeposit] = useState(true);
  const [chama, setChama] = useState<Chama>();
  const [members, setMembers] = useState<User[]>();
  const [lockedAmount, setLockedAmount] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [chamaPayout, setChamaPayout] = useState<Payout []> ();
  const chamaId = useChamaId();

  const fetchChama = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }
      const response = await fetch(`${url}/chama/${chamaId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch chama data");
      }

      const results = await response.json();
      setChama(results.chama);
      setChamaPayout(results.chama.payOuts)
      setMembers(results.chama.members);
      setLockedAmount(results.chamaBalance[1]);
      setBalance(Number(results.chamaBalance[0]));
      setIsMember(results.isMember);
    } catch (err) {
      console.log(err);
      setError("An error occurred");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chamaId) {
      fetchChama();
    } else {
      setError("No chama selected");
      setLoading(false);
    }
  }, [chamaId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      await fetchChama();
    } catch (error) {
      console.error("Refresh failed:", error);
      setError("Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    // hour: "numeric",
    // minute: "numeric",
    // hour12: false,
  });

  const toggleView = () => {
    setShowDeposit(!showDeposit);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!chama?.startDate || !chama?.cycleTime || !chama?.members) return 0;

    const startDate = new Date(chama.startDate);
    const startTime = startDate.getTime();

    // Calculate end date by adding (cycleTime * members.length) days to start date
    const endDate = new Date(startDate);
    endDate.setDate(
      startDate.getDate() + chama.cycleTime * chama.members.length
    );
    const endTime = endDate.getTime();

    const currentTime = Date.now();

    if (currentTime < startTime) return 0;
    if (currentTime >= endTime) return 100;

    const totalDuration = endTime - startTime;
    const elapsedDuration = currentTime - startTime;
    return Math.min((elapsedDuration / totalDuration) * 100, 100);
  };

  const progress = calculateProgress();

  //function to ge a members payout date
  const getMemberPayoutDate = (
    startDate: Date,
    durationDays: number,
    memberIndex: number
  ) => {
    const payoutDate = new Date(startDate);
    payoutDate.setDate(payoutDate.getDate() + durationDays * (memberIndex + 1));
    return payoutDate;
  };

  // Get time remaining until chama starts
  const getTimeUntilStart = () => {
    if (!chama?.startDate) return "";
    const startTime = new Date(chama.startDate).getTime();
    const currentTime = Date.now();
    return formatTimeRemaining(Math.max(0, startTime - currentTime));
  };

  if (!isMember && !loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          backgroundColor: background,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 16 }}>
          Join this chama to view schedule
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e2e8f0",
        }}
      >
        <ActivityIndicator size="large" color="#66d9d0" />
        <Text style={{ marginTop: 16 }}>Loading schedule...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e2e8f0",
          padding: 20,
        }}
      >
        <Ionicons name="warning-outline" size={48} color="#E53E3E" />
        <Text
          style={{
            fontSize: 18,
            color: "#E53E3E",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {error}
        </Text>

        <Text style={{ color: "white" }}>Try Again</Text>
      </View>
    );
  }

  if (!chama) {
    return (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <ActivityIndicator size="small" color="#66d9d0" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        backgroundColor: "#e2e8f0",
        padding: 16,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#66d9d0"]}
        />
      }
    >
      {/* Top right balance display */}
      {chama?.type === "Public" ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#E0F7F4",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#B2DFDB",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            alignSelf: "center",
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={{ textAlign: "center" }}>Chama Balance</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} />
              <Text style={{ color: "#4A5568", marginHorizontal: 4 }}>
                {Number(lockedAmount) / 10 ** 18} cKES
              </Text>
              <View
                style={{
                  width: 1,
                  height: 24,
                  backgroundColor: "#A0AEC0",
                  marginHorizontal: 8,
                }}
              />
              <Text style={{ color: "#2D3748", marginHorizontal: 4 }}>
                {(balance!! / 10 ** 18)} cKES
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#E0F7F4",
            padding: 3,
            borderRadius: 8,
            borderColor: "#B2DFDB",
            borderWidth: 1,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            alignSelf: "center",
          }}
        >
          <View style={{ alignItems: "center", paddingHorizontal: 8 }}>
            <Text style={{ color: "#2D3748" }}>Chama Balance</Text>
            <Text style={{ color: "#4A5568" }}>{balance!! / 10 ** 18}cKES</Text>
          </View>
        </View>
      )}

      {/* Cycle progress container */}

      <View style={{ marginTop: 48, alignItems: "center" }}>
        <Suspense fallback={<Text>Loading...</Text>}>
          <View
            style={{
              width: 250,
              height: 250,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* SVG Circle */}
            <Svg
              width={250}
              height={250}
              viewBox={`0 0 ${circleRadius * 2} ${circleRadius * 2}`}
            >
              {/* Background Track */}
              <Circle
                cx={circleRadius}
                cy={circleRadius}
                r={circleRadius - 20}
                stroke={trackColor}
                strokeWidth={20}
                fill="transparent"
              />
              {/* Progress Track - only show if chama has started */}
              {chama?.started && (
                <Circle
                  cx={circleRadius}
                  cy={circleRadius}
                  r={circleRadius - 20}
                  stroke={strokeColor}
                  strokeWidth={20}
                  fill="transparent"
                  strokeDasharray={`${(
                    (progress / 100) *
                    2 *
                    Math.PI *
                    (circleRadius - 20)
                  ).toFixed(2)} ${2 * Math.PI * (circleRadius - 20)}`}
                  transform={`rotate(-90 ${circleRadius} ${circleRadius})`}
                />
              )}
            </Svg>
            {/* Center Text */}
            <View
              style={{
                position: "absolute",
                width: 180,
                height: 180,
                backgroundColor: "#ffffff",
                borderRadius: 90,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {chama?.started ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                    CYCLE
                  </Text>
                  <Text
                    style={{ fontSize: 48, fontWeight: "600", marginTop: 16 }}
                  >
                    {chama?.cycleTime || 1}
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: "center", padding: 16 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Starts in
                  </Text>
                  <Text
                    style={{ fontSize: 24, fontWeight: "600", marginTop: 8 }}
                  >
                    {getTimeUntilStart()}
                  </Text>
                </View>
              )}
            </View>
            {/* Member clouds - only show if chama has started */}
            {members?.map((member, index) => {
              if (!chama?.startDate || !chama?.cycleTime) return null;

              const startDate = new Date(chama.startDate);
              const payoutDate = getMemberPayoutDate(
                startDate,
                chama.cycleTime,
                index
              );
              const isPastPayout = payoutDate.getTime() <= Date.now();

              // Calculate angle for each member (evenly spaced around the circle)
              const angle = (index / members.length) * 2 * Math.PI;
              const distanceFromCenter = 100; // Distance from center of circle

              return (
                <Animated.View
                  key={index}
                  style={{
                    position: "absolute",
                    top: 125 + Math.sin(angle) * distanceFromCenter - 25, // Subtract half height
                    left: 125 + Math.cos(angle) * distanceFromCenter - 45, // Subtract half width
                    width: 90,
                    height: 50,
                    borderRadius: 30,
                    backgroundColor: isPastPayout ? "#66d9d0" : "#E0F7FA",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    padding: 4,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {chama.started ? member?.name || "Unknown" : "--"}
                  </Text>
                  <Text style={{ fontSize: 10 }}>
                    {dateFormat.format(payoutDate)}
                  </Text>
                  {isPastPayout && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#4CAF50"
                    />
                  )}
                </Animated.View>
              );
            })}
          </View>
        </Suspense>
      </View>

      {/* Payment History */}
      <View style={{ marginTop: 48, alignItems: "center", width: "100%" }}>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
          Payment History
        </Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#CBD5E0",
            paddingVertical: 4,
            borderRadius: 8,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={showDeposit ? () => toggleView() : () => null}
            style={{
              flex: 1,
              backgroundColor: !showDeposit ? "#66d9d0" : "transparent",
              paddingVertical: 8,
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <Text>Payouts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={!showDeposit ? () => toggleView() : () => null}
            style={{
              flex: 1,
              backgroundColor: showDeposit ? "#66d9d0" : "transparent",
              paddingVertical: 8,
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <Text>Deposits</Text>
          </TouchableOpacity>
        </View>
        {/* Conditionally render Withdrawals or Deposits */}
        <View style={{ marginTop: 8, width: "100%" }}>
          {!showDeposit ? (
            <PayoutsHistory payouts={chamaPayout} />
          ) : (
            <DepositsHistory chamaId={chamaId} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ScheduleScreen;
