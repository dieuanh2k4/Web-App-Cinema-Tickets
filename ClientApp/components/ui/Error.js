import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * ErrorMessage - Inline error message
 * @param {string} message - Error message to display
 * @param {function} onRetry - Optional retry callback
 */
export function ErrorMessage({ message, onRetry }) {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * ErrorScreen - Full screen error with retry option
 */
export function ErrorScreen({
    title = "Đã xảy ra lỗi",
    message = "Không thể tải dữ liệu. Vui lòng thử lại sau.",
    onRetry,
    icon = "alert-circle-outline"
}) {
    return (
        <View style={styles.fullScreen}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={80} color="#F44336" />
            </View>
            <Text style={styles.errorTitle}>{title}</Text>
            <Text style={styles.errorDescription}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButtonLarge} onPress={onRetry}>
                    <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * NetworkError - Specific error for network issues
 */
export function NetworkError({ onRetry }) {
    return (
        <ErrorScreen
            title="Lỗi kết nối"
            message="Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
            icon="wifi-off"
            onRetry={onRetry}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(244, 67, 54, 0.3)",
        margin: 16,
    },
    message: {
        color: "#F44336",
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    retryButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#F44336",
        borderRadius: 6,
    },
    retryText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },
    fullScreen: {
        flex: 1,
        backgroundColor: "#0F0F0F",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    errorTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: "center",
    },
    errorDescription: {
        color: "#888888",
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 24,
    },
    retryButtonLarge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6C47DB",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
