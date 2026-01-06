import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * LoadingOverlay - Full screen loading overlay
 * @param {boolean} visible - Show/hide loading
 * @param {string} message - Optional loading message
 */
export function LoadingOverlay({ visible, message = "Đang tải..." }) {
    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#6C47DB" />
                    <Text style={styles.loadingText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
}

/**
 * LoadingScreen - Full screen loading for initial loads
 */
export function LoadingScreen({ message = "Đang tải..." }) {
    return (
        <LinearGradient
            colors={["#0F0F0F", "#0F0F0F", "#260d71ff"]}
            locations={[0, 0.7, 1]}
            style={styles.fullScreen}
        >
            <ActivityIndicator size="large" color="#6C47DB" />
            <Text style={styles.loadingText}>{message}</Text>
        </LinearGradient>
    );
}

/**
 * LoadingSpinner - Simple inline spinner
 */
export function LoadingSpinner({ size = "small", color = "#6C47DB" }) {
    return <ActivityIndicator size={size} color={color} />;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingBox: {
        backgroundColor: "#1A1A1A",
        paddingHorizontal: 40,
        paddingVertical: 30,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },
    loadingText: {
        color: "#FFFFFF",
        fontSize: 15,
        marginTop: 16,
        fontWeight: "500",
    },
    fullScreen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
