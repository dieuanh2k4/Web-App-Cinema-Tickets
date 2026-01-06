import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { chatService } from "../services/chatService";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AIChatButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "1",
            text: "Xin chào! Tôi là CineBot 🤖, trợ lý AI của CineBook. Tôi có thể giúp bạn tìm phim, đặt vé, hoặc trả lời câu hỏi. Bạn cần gì?",
            isBot: true,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Pulse animation for the button
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            isBot: false,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const messageToSend = inputText.trim();
        setInputText("");
        setIsTyping(true);

        try {
            // Call real API
            const response = await chatService.sendMessage(messageToSend);

            // Add delay to make it feel more natural (1-2 seconds)
            await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: response?.Reply || response?.reply || "Xin lỗi, tôi không thể trả lời lúc này.",
                isBot: true,
                timestamp: new Date(),
                suggestions: response?.Suggestions || response?.suggestions || [],
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau! 🙏",
                isBot: true,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageBubble,
                item.isBot ? styles.botBubble : styles.userBubble,
            ]}
        >
            {item.isBot && (
                <View style={styles.botAvatar}>
                    <MaterialCommunityIcons name="robot" size={20} color="#6C47DB" />
                </View>
            )}
            <View
                style={[
                    styles.messageContent,
                    item.isBot ? styles.botContent : styles.userContent,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        item.isBot ? styles.botText : styles.userText,
                    ]}
                >
                    {item.text}
                </Text>
                <Text style={styles.timestamp}>
                    {item.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </View>
        </View>
    );

    return (
        <>
            {/* Floating Button */}
            <Animated.View
                style={[
                    styles.floatingButton,
                    { transform: [{ scale: pulseAnim }] },
                ]}
            >
                <TouchableOpacity
                    style={styles.buttonInner}
                    onPress={() => setIsVisible(true)}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={["#8B5CF6", "#6C47DB"]}
                        style={styles.gradient}
                    >
                        <MaterialCommunityIcons
                            name="robot-happy"
                            size={28}
                            color="#FFFFFF"
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            {/* Chat Modal */}
            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Header */}
                        <LinearGradient
                            colors={["#6C47DB", "#8B5CF6"]}
                            style={styles.modalHeader}
                        >
                            <View style={styles.headerLeft}>
                                <View style={styles.headerAvatar}>
                                    <MaterialCommunityIcons
                                        name="robot-happy"
                                        size={24}
                                        color="#6C47DB"
                                    />
                                </View>
                                <View>
                                    <Text style={styles.headerTitle}>CineBot AI</Text>
                                    <Text style={styles.headerSubtitle}>
                                        {isTyping ? "Đang nhập..." : "Online"}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsVisible(false)}
                            >
                                <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </LinearGradient>

                        {/* Messages */}
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderMessage}
                            keyExtractor={(item) => item.id}
                            style={styles.messagesList}
                            contentContainerStyle={styles.messagesContent}
                            onContentSizeChange={() =>
                                flatListRef.current?.scrollToEnd({ animated: true })
                            }
                            showsVerticalScrollIndicator={false}
                        />

                        {/* Typing indicator */}
                        {isTyping && (
                            <View style={styles.typingIndicator}>
                                <View style={styles.typingDots}>
                                    <View style={[styles.dot, styles.dot1]} />
                                    <View style={[styles.dot, styles.dot2]} />
                                    <View style={[styles.dot, styles.dot3]} />
                                </View>
                                <Text style={styles.typingText}>CineBot đang nhập...</Text>
                            </View>
                        )}

                        {/* Input */}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nhập tin nhắn..."
                                    placeholderTextColor="#888"
                                    value={inputText}
                                    onChangeText={setInputText}
                                    onSubmitEditing={sendMessage}
                                    returnKeyType="send"
                                    multiline
                                    maxLength={500}
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.sendButton,
                                        !inputText.trim() && styles.sendButtonDisabled,
                                    ]}
                                    onPress={sendMessage}
                                    disabled={!inputText.trim()}
                                >
                                    <MaterialCommunityIcons
                                        name="send"
                                        size={22}
                                        color={inputText.trim() ? "#FFFFFF" : "#888"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <TouchableOpacity
                                style={styles.quickButton}
                                onPress={() => setInputText("Phim đang chiếu")}
                            >
                                <Text style={styles.quickButtonText}> Phim hay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.quickButton}
                                onPress={() => setInputText("Đặt vé")}
                            >
                                <Text style={styles.quickButtonText}> Đặt vé</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.quickButton}
                                onPress={() => setInputText("Rạp gần tôi")}
                            >
                                <Text style={styles.quickButtonText}> Rạp gần</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        bottom: 80,
        right: 20,
        zIndex: 1000,
        elevation: 10,
        shadowColor: "#6C47DB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    buttonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: "hidden",
    },
    gradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        height: screenHeight * 0.85,
        backgroundColor: "#0F0F0F",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
    headerSubtitle: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 13,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    messagesList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    messagesContent: {
        paddingVertical: 16,
    },
    messageBubble: {
        flexDirection: "row",
        marginBottom: 12,
        maxWidth: "85%",
    },
    botBubble: {
        alignSelf: "flex-start",
    },
    userBubble: {
        alignSelf: "flex-end",
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#1A1A1A",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    messageContent: {
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        maxWidth: screenWidth * 0.7,
    },
    botContent: {
        backgroundColor: "#1A1A1A",
        borderBottomLeftRadius: 4,
    },
    userContent: {
        backgroundColor: "#6C47DB",
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    botText: {
        color: "#FFFFFF",
    },
    userText: {
        color: "#FFFFFF",
    },
    timestamp: {
        fontSize: 11,
        color: "rgba(255,255,255,0.5)",
        marginTop: 4,
        alignSelf: "flex-end",
    },
    typingIndicator: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 8,
        gap: 8,
    },
    typingDots: {
        flexDirection: "row",
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#6C47DB",
        opacity: 0.5,
    },
    dot1: {
        opacity: 1,
    },
    dot2: {
        opacity: 0.7,
    },
    dot3: {
        opacity: 0.4,
    },
    typingText: {
        color: "#888",
        fontSize: 13,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#1A1A1A",
        gap: 10,
    },
    textInput: {
        flex: 1,
        backgroundColor: "#0F0F0F",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: "#FFFFFF",
        fontSize: 15,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#6C47DB",
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonDisabled: {
        backgroundColor: "#2A2A2A",
    },
    quickActions: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#0F0F0F",
        borderTopWidth: 1,
        borderTopColor: "#1A1A1A",
    },
    quickButton: {
        backgroundColor: "#1A1A1A",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },
    quickButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "500",
    },
});
