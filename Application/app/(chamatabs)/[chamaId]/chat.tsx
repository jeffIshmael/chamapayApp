import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo
import AsyncStorage from '@react-native-async-storage/async-storage';


import { url } from '@/constants/Endpoint';
import {useChamaId} from "@/app/context/ChamaContext";

interface User{
    name:string;
    id:number;
    address:string;
}

interface Message{
    id:number;
    senderId:number;
    text: string;
    timestamp: number;
    sender: User;
};

interface Chama{
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
    members: [];
    messages: Message [];
  };
  interface Detail{
    chama: Chama;
    me: number;
};

const ChatComponent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const[chama, setChama] = useState <Chama>();
    const [allDetails, setAllDetails] = useState <Detail> ();
    const [messages, setMessages] = useState <Message[]>();
    const [text, setText]= useState("");
    const chamaId = useChamaId();
    const messagesEndRef = useRef<ScrollView>(null);


    useEffect(() => {
        const fetchChama = async () => {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.log("No token found");
            return;
          }    
          try {
            const response = await fetch(`${url}/chama/messages/${chamaId}`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
            const results = await response.json();
            if (response.ok) {
              console.log("gotten");
              console.log(results);
              setAllDetails(results);
              setChama(results?.chama);
              setMessages(results?.chama?.messages);
            //   setMembers(results.members);
            } else {
              console.log(results.message);
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchChama();
      }, [chamaId]);


    //function to handle the sent message
    const sendMessage = async () => {
        if (!text.trim()) return;
        const token = await AsyncStorage.getItem("token");
        if(!token){
            console.log("No token found!");
            return;
        };
        try {
            console.log(text);
            const response = await fetch(`${url}/chama/${chamaId}`,{
                method:"POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` },
                body:JSON.stringify({
                    content: text,
                }),
            });
            const results = await response.json();
            if(response.ok){
                console.log(results);
                  // Clear input field
        setText("");

        // Add the new message to the list
        const newMessage: Message = {
          id: results.id,
          senderId: allDetails?.me || 0,
          text: text,
          timestamp: Date.now(),
          sender: {
            id: allDetails?.me || 0 ,
            name: "You",
            address: results?.sender,
          },
        };

        setMessages((prevMessages: Message[] | undefined) => [...(prevMessages ?? []), newMessage]);

        // Scroll to the latest message
        setTimeout(() => {
          messagesEndRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Show confirmation alert
        Alert.alert("Success", "Message sent!");
            }else{
                console.log("an issue with the api");
                console.log(response);
            }            
        } catch (error) {
            console.log(error);            
        }
    }

    const me = "user";
   

    const groupInfo = {
        profilePic: 'https://ipfs.io/ipfs/Qmd1VFua3zc65LT93Sv81VVu6BGa2QEuAakAFJexmRDGtX/1.jpg', // Replace with actual image URL
        groupName: 'Group Chat',
        membersCount: 5,
    };

    return (
        <>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Image source={{ uri: groupInfo.profilePic }} style={styles.profilePic} />
                <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{chama?.name}</Text>
                    <Text style={styles.membersCount}>{(chama?.members)?.length} members</Text>
                </View>
            </View>

            {/* Chat Area */}
            <ScrollView
                style={styles.chatContainer}
                contentContainerStyle={styles.chatContent}
                ref={messagesEndRef}
            >
                {loading ? (
                    <Text style={styles.loadingText}>Loading messages...</Text>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : messages?.length === 0 ? (
                    <Text style={styles.noMessagesText}>No messages yet. Start chatting!</Text>
                ) : (
                    messages?.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageContainer,
                                msg?.senderId === allDetails?.me ? styles.alignEnd : styles.alignStart,
                            ]}
                        >
                            <View
                                style={[
                                    styles.messageBubble,
                                    msg?.senderId === allDetails?.me ? styles.userMessage : styles.otherMessage,
                                ]}
                            >
                                <Text style={styles.messageText}>{msg.text}</Text>
                                <Text style={styles.timestampText}>
                                    {new Date(msg.timestamp).toLocaleString("en-GB", {
                                        hour: "numeric",
                                        minute: "numeric",
                                    })}
                                </Text>
                            </View>
                            <Text style={styles.senderText}>
                                {msg?.senderId === allDetails?.me ? 'you' : `${(msg.sender?.address).slice(0,6)}...${(msg.sender?.address).slice(-4)}`}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    multiline
                    value={text}
                    onChangeText={setText}
                    placeholder="Type your message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <MaterialIcons name="send" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    backButton: {
        marginRight: 12,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    groupInfo: {
        flexDirection: 'column',
    },
    groupName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    membersCount: {
        fontSize: 12,
        color: '#6B7280',
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 16,
    },
    chatContent: {
        paddingBottom: 16,
    },
    loadingText: {
        textAlign: 'center',
        color: '#6B7280',
    },
    errorText: {
        textAlign: 'center',
        color: '#EF4444',
    },
    noMessagesText: {
        textAlign: 'center',
        color: '#6B7280',
    },
    messageContainer: {
        marginBottom: 8,
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    alignStart: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 8,
        borderRadius: 8,
    },
    userMessage: {
        backgroundColor: '#A7F3D0',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#E5E7EB',
    },
    messageText: {
        fontSize: 16,
        color: '#1F2937',
    },
    timestampText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    senderText: {
        fontSize: 12,
        color: '#6B7280',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    textInput: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#34D399',
        padding: 12,
        borderRadius: 8,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatComponent;
