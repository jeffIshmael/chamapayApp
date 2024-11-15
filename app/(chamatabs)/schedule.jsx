import React, { Suspense, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import DepositsHistory from "@/components/Deposit";
import WithdrawalsHistory from '@/components/Withdrawal';
// import Svg, { Path } from 'react-native-svg';
// import Withdrawals from './Withdrawals';
// import Deposits from './Deposits';

const ScheduleScreen = () => {
  const [isPublic, setIsPublic]= useState(true);
  const [showDeposit, setShowDeposit]= useState(true);
  const members = [{name:"Jeff"}];
  const round = 1;
  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const toggleView = () =>{
    setShowDeposit(!showDeposit);
  }




  return (
    <ScrollView contentContainerStyle={{ minHeight: '100%', backgroundColor: '#e2e8f0', padding: 16 }}>
      {/* Top right balance display */}
      {isPublic ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F7F4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#B2DFDB', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ textAlign: 'center' }}>Chama Balance</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Ionicons name="lock-closed-outline" size={20} />
              <Text style={{ color: '#4A5568' }}>0 cKES</Text>
              <View style={{ width: 1, height: 24, backgroundColor: '#A0AEC0', marginHorizontal: 16 }} />
              <Text style={{ color: '#2D3748' }}>0 cKES</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', backgroundColor: '#E0F7F4', padding: 8, borderRadius: 8, borderColor: '#B2DFDB', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#2D3748' }}>Chama Balance</Text>
            <Text style={{ color: '#4A5568' }}>0 cKES</Text>
          </View>
        </View>
      )}

      {/* Cycle progress container */}
      <View style={{ marginTop: 48, alignItems: 'center' }}>
        <Suspense fallback={<Text>Loading...</Text>}>
          <View
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              backgroundColor: '#ffffff',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ position: 'absolute', width: 180, height: 180, backgroundColor: '#ffffff', borderRadius: 90, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold' }}>CYCLE</Text>
                <Text style={{ fontSize: 48, fontWeight: '600', marginTop: 16 }}>{round}</Text>
              </View>
            </View>

            {/* Member clouds */}
            {members.map((address, index) => (
              <View
                key={address}
                style={{
                  position: 'absolute',
                  width: 100,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#66d9d0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  padding: 8,
                  // ...calculateMemberPosition(index)
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{address?.name || 'Unknown'}</Text>
                <Text style={{ fontSize: 10 }}>{dateFormat.format(Date.now())}</Text>
              </View>
            ))}
          </View>
        </Suspense>
      </View>

      {/* Payment History */}
      <View style={{ marginTop: 48, alignItems: 'center', width: '100%' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Payment History</Text>
        <View style={{ flexDirection: 'row', backgroundColor: '#CBD5E0', paddingVertical: 4, borderRadius: 8, width: '100%' }}>
          <TouchableOpacity
            onPress={() => toggleView('withdrawals')}
            style={{
              flex: 1,
              backgroundColor: !showDeposit ? '#66d9d0' : 'transparent',
              paddingVertical: 8,
              alignItems: 'center',
              borderRadius: 8,
            }}
          >
            <Text>Withdrawals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleView('deposits')}
            style={{
              flex: 1,
              backgroundColor: showDeposit ? '#66d9d0' : 'transparent',
              paddingVertical: 8,
              alignItems: 'center',
              borderRadius: 8,
            }}
          >
            <Text>Deposits</Text>
          </TouchableOpacity>
        </View>

        {/* Conditionally render Withdrawals or Deposits */}
        <View style={{ marginTop: 8, width: '100%' }}>
          {!showDeposit ? (
            <WithdrawalsHistory />
          ) : (
            <DepositsHistory />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ScheduleScreen;
