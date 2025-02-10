import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import DepositQr from "@/components/DepositQr";

const DepositScreen = () => {
    const [mpesaVisible, setMpesaVisible] = useState(false);
    const walletAddress = "0x3524..";

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: '#F7F9FC', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Deposit from:</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 20 }}>
                <TouchableOpacity 
                    onPress={() => setMpesaVisible(false)}
                    style={{
                        backgroundColor: mpesaVisible ? '#E0E0E0' : '#008080',
                        paddingVertical: 12,
                        width: '48%',
                        borderRadius: 10,
                        alignItems: 'center'
                    }}>
                    <Text style={{ color: mpesaVisible ? '#000' : '#FFF', fontSize: 16, fontWeight: 'bold' }}>Crypto Exchange</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={() => setMpesaVisible(true)}
                    style={{
                        backgroundColor: mpesaVisible ? '#008080' : '#E0E0E0',
                        paddingVertical: 12,
                        width: '48%',
                        borderRadius: 10,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                    <Image 
                        source={require('../assets/images/mpesa.png')}
                        style={{ width: 36, height: 24, marginRight: 12 }}
                    />
                    <Text style={{ color: mpesaVisible ? '#FFF' : '#000', fontSize: 16, fontWeight: 'bold' }}>M-Pesa</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{ width: '100%', alignItems: 'center' }}>
                {mpesaVisible ? (
                    <View style={{ width: '90%', padding: 16, backgroundColor: '#FFF', borderRadius: 12, shadowOpacity: 0.1, shadowRadius: 4 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Input Phone Number (To be prompted)</Text>
                        <TextInput
                            placeholder='Phone number'
                            keyboardType='numeric'
                            style={{ borderWidth: 1, borderColor: '#B2DFDB', borderRadius: 8, padding: 10, marginBottom: 16 }}
                        />
                        
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Enter Amount</Text>
                        <Text style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>NB: Amount of cKES you wish to deposit</Text>
                        <TextInput
                            placeholder='Amount'
                            keyboardType='numeric'
                            style={{ borderWidth: 1, borderColor: '#B2DFDB', borderRadius: 8, padding: 10, marginBottom: 16 }}
                        />
                        
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#008080', marginBottom: 16 }}>Amount needed: 4 Kshs</Text>
                        
                        <TouchableOpacity style={{ backgroundColor: '#008080', padding: 12, borderRadius: 8, alignItems: 'center' }}>
                            <Text style={{ color: '#FFF', fontSize: 16 }}>Deposit</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <DepositQr walletAddress={walletAddress} />
                )}
            </View>
        </View>
    );
};

export default DepositScreen;
