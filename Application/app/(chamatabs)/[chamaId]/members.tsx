import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
// import { Clipboard } from "react-native"; // This imports clipboard for copying
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

import { url } from "@/constants/Endpoint";
import { useChamaId } from "@/app/context/ChamaContext";
import { ActivityIndicator } from "react-native";
import { background } from "@/constants/Colors";
import { imageMap } from "@/constants/Images";

interface User {
  id: number;
  name: string;
  address: string;
  role: string;
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
}

const GroupDetails = () => {
  const [chama, setChama] = useState<Chama>();
  const [members, setMembers] = useState<User[]>();
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState <boolean | null> (null);
  const chamaId = useChamaId();

  useEffect(() => {
    const fetchChama = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        console.log(chamaId);
        const response = await fetch(`${url}/chama/${chamaId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const results = await response.json();
        if (response.ok) {
          setChama(results.chama);
          setMembers(results.chama.members);
          setIsMember(results.isMember);
        } else {
          console.log(results.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChama();
  }, [chamaId]);

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
          Join this chama to view its members
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
        <Text style={{ marginTop: 16 }}>Loading members...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#e0f2f1",
        paddingVertical: 16,
        paddingHorizontal: 8,
      }}
    >
      {/* Group Header */}
      <View style={{ alignItems: "center", marginBottom: 16, marginTop: 16 }}>
        <View
          style={{
            width: 112,
            height: 112,
            borderRadius: 56,
            overflow: "hidden",
            marginBottom: 8,
            elevation: 4,
          }}
        >
          <Image
            source={imageMap[(chamaId).toString()] || require('@/assets/images/default.png')}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#00796b",
            marginBottom: 8,
          }}
        >
          {chama?.name ?? ""}
        </Text>
        {/* Group Invite Link Section */}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#00796b",
              marginRight: 8,
            }}
          >
            groupLink
          </Text>
          {/* Clipboard Icon */}
          <Ionicons name="clipboard" size={20} color="#00796b" />
        </TouchableOpacity>
      </View>
      {/* Members Section */}
      <View
        style={{
          width: "100%",
          maxWidth: 320,
          backgroundColor: "#ffffff",
          borderRadius: 8,
          padding: 16,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "#4e4e4e",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Members
        </Text>
        {loading && <Text>Loading...</Text>}
        {members?.map((member, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
              paddingVertical: 8,
              borderBottomWidth: index < members.length - 1 ? 1 : 0,
              borderBottomColor: "#e0e0e0",
            }}
          >
            <View
              style={{
                backgroundColor: "#b2dfdb",
                padding: 8,
                borderRadius: 24,
                marginRight: 16,
              }}
            >
              {/* Member Icon */}
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-filled/50/00796b/user-male-circle.png",
                }}
                style={{ width: 32, height: 32, tintColor: "#00796b" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#4e4e4e" }}
              >
                {member?.name || "User"}
              </Text>
              <Text style={{ fontSize: 14, color: "#9e9e9e" }}>
                {member?.address
                  ? `${(member?.address).slice(
                      0,
                      6
                    )}...${(member?.address).slice(-4)}`
                  : "Loading..."}
              </Text>
            </View>
            {member?.id === chama?.adminId && (
              <Text
                style={{ fontSize: 14, color: "#757575", textAlign: "right" }}
              >
                Admin
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default GroupDetails;
