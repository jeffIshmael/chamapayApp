import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

const ChatComponent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    const messages = [{
        id: 1,
        text: 'Hello, how are you?',
        sender: 'user',
        timestamp: Date.now(),
    }, {
        id: 2,
        text: 'I am fine, and you?',
        sender: 'other',
        timestamp: Date.now(),
    }];

    const me = "user";
    const messagesEndRef = useRef(null);

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
                    <Text style={styles.groupName}>{groupInfo.groupName}</Text>
                    <Text style={styles.membersCount}>{groupInfo.membersCount} members</Text>
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
                ) : messages.length === 0 ? (
                    <Text style={styles.noMessagesText}>No messages yet. Start chatting!</Text>
                ) : (
                    messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageContainer,
                                msg?.sender === me ? styles.alignEnd : styles.alignStart,
                            ]}
                        >
                            <View
                                style={[
                                    styles.messageBubble,
                                    msg?.sender === me ? styles.userMessage : styles.otherMessage,
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
                                {msg.sender === me ? 'you' : msg.sender}
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
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message..."
                />
                <TouchableOpacity style={styles.sendButton}>
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
