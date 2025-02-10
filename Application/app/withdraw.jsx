import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,Image,
} from "react-native";
import React, { useState } from "react";

const WithdrawScreen = () => {
  const [amount, setAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("exchange"); // Default to External Exchange
  const transactionFee = 0.45;

  const handleMaxPress = () => {
    setAmount("100"); // Replace with actual max balance logic
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: 16,
        paddingHorizontal: 16,
        backgroundColor: "#F7F9FC",
      }}
    >
      <View style={{ width: "100%", alignSelf: "center" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Withdraw Funds via:
        </Text>

        {/* Withdrawal Method Selection */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => setWithdrawMethod("exchange")}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor:
                withdrawMethod === "exchange" ? "#008080" : "#E0F2F1",
              alignItems: "center",
              borderRadius: 8,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: withdrawMethod === "exchange" ? "#FFF" : "#008080",
                fontWeight: "bold",
              }}
            >
              External Exchange
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setWithdrawMethod("mpesa")}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor:
                withdrawMethod === "mpesa" ? "#008080" : "#E0F2F1",
              alignItems: "center",
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/images/mpesa.png")}
              style={{ width: 36, height: 24, marginRight: 12 }}
            />
            <Text
              style={{
                color: withdrawMethod === "mpesa" ? "#FFF" : "#008080",
                fontWeight: "bold",
              }}
            >
              M-Pesa
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields Based on Withdrawal Method */}
        {withdrawMethod === "exchange" ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>
              Wallet Address
            </Text>
            <Text>NB: Ensure the wallet is on celo</Text>
            <TextInput
              placeholder="Enter wallet address"
              keyboardType="ascii-capable"
              style={{
                borderWidth: 1,
                borderColor: "#B2DFDB",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#FFF",
                width: "100%",
              }}
            />
          </View>
        ) : (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>
              M-Pesa Phone Number(To be prompted)
            </Text>
            <TextInput
              placeholder="Enter M-Pesa phone number"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#B2DFDB",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#FFF",
                width: "100%",
              }}
            />
          </View>
        )}

        {/* Amount Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>
            Amount
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#B2DFDB",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#FFF",
              width: "100%",
            }}
          >
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={handleMaxPress}
              style={{
                backgroundColor: "#008080",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold" }}>Max</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction Fee */}
        <Text style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
          Transaction Fee: {transactionFee} cKES
        </Text>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#008080",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default WithdrawScreen;
