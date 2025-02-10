import React, { Suspense, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DepositsHistory from "@/components/Deposit";
import WithdrawalsHistory from "@/components/Withdrawal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "@/constants/Endpoint";
import Svg, { Circle, Text as SvgText } from "react-native-svg"; // Import SVG components

// Constants for the circle
const screenWidth = Dimensions.get("window").width;
const circleRadius = 100; // Radius of the circle
const strokeColor = "#66d9d0"; // Color of the progress bar
const trackColor = "#e2e8f0"; // Background color of the circle

interface User {
  id: number;
  name: string;
  address: string;
  role: string;
}
interface Member {
  user: User;
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
  members: Member[];
}

const ScheduleScreen = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [showDeposit, setShowDeposit] = useState(true);
  const [chama, setChama] = useState<Chama>();
  const [members, setMembers] = useState<Member[]>();
  const chamaId = 5;

  useEffect(() => {
    const fetchChama = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      try {
        const response = await fetch(`${url}/chama/${chamaId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const results = await response.json();
        if (response.ok) {
          setChama(results);
          setMembers(results.members);
        } else {
          console.log(results.message);
        }
      } catch (error) {
        console.error(error);
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

  const toggleView = () => {
    setShowDeposit(!showDeposit);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!chama?.startDate || !chama?.payDate) return 0;

    const startDate = new Date(chama.startDate).getTime();
    const endDate = new Date(chama.payDate).getTime();
    const currentTime = Date.now();

    if (currentTime < startDate) return 0;
    if (currentTime >= endDate) return 100;

    const totalDuration = endDate - startDate;
    const elapsedDuration = currentTime - startDate;
    return Math.min((elapsedDuration / totalDuration) * 100, 100);
  };

  const progress = calculateProgress();

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        backgroundColor: "#e2e8f0",
        padding: 16,
      }}
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
                0 cKES
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
                0 cKES
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
            <Text style={{ color: "#4A5568" }}>0 cKES</Text>
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
              {/* Progress Track */}
              <Circle
                cx={circleRadius}
                cy={circleRadius}
                r={circleRadius - 20}
                stroke={strokeColor}
                strokeWidth={20}
                fill="transparent"
                strokeDasharray={`${((progress / 100) * 2 * Math.PI * (circleRadius - 20)).toFixed(
                  2
                )} ${2 * Math.PI * (circleRadius - 20)}`}
                transform={`rotate(-90 ${circleRadius} ${circleRadius})`}
              />
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
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 32, fontWeight: "bold" }}>CYCLE</Text>
                <Text
                  style={{ fontSize: 48, fontWeight: "600", marginTop: 16 }}
                >
                  {chama?.cycleTime || 1}
                </Text>
              </View>
            </View>

            {/* Member clouds */}
            {members?.map((member, index) => (
              <View
                key={index}
                style={{
                  position: "absolute",
                  top: 125 + Math.sin((index / members.length) * 2 * Math.PI) * 100,
                  left: 125 + Math.cos((index / members.length) * 2 * Math.PI) * 100,
                  width: 100,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#66d9d0",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  padding: 8,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  {member?.user?.name || "Unknown"}
                </Text>
                <Text style={{ fontSize: 10 }}>
                  {dateFormat.format(Date.now())}
                </Text>
              </View>
            ))}
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
            <Text>Withdrawals</Text>
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
          {!showDeposit ? <WithdrawalsHistory /> : <DepositsHistory />}
        </View>
      </View>
    </ScrollView>
  );
};

export default ScheduleScreen;