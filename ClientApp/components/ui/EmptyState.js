import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * EmptyState - Display when no data available
 * @param {string} icon - Icon name from MaterialCommunityIcons
 * @param {string} title - Title text
 * @param {string} description - Description text
 * @param {string} actionText - Button text (optional)
 * @param {function} onAction - Button callback (optional)
 */
export function EmptyState({
    icon = "inbox-outline",
    title = "Không có dữ liệu",
    description = "Chưa có nội dung nào để hiển thị.",
    actionText,
    onAction,
}) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={64} color="#444444" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            {actionText && onAction && (
                <TouchableOpacity style={styles.actionButton} onPress={onAction}>
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * NoMovies - Specific empty state for movies
 */
export function NoMovies({ onRefresh }) {
    return (
        <EmptyState
            icon="movie-off-outline"
            title="Chưa có phim"
            description="Hiện tại chưa có phim nào. Vui lòng quay lại sau!"
            actionText={onRefresh ? "Tải lại" : undefined}
            onAction={onRefresh}
        />
    );
}

/**
 * NoTickets - Specific empty state for tickets
 */
export function NoTickets({ onBook }) {
    return (
        <EmptyState
            icon="ticket-outline"
            title="Chưa có vé nào"
            description="Bạn chưa đặt vé xem phim nào. Đặt vé ngay để không bỏ lỡ những bộ phim hay!"
            actionText={onBook ? "Đặt vé ngay" : undefined}
            onAction={onBook}
        />
    );
}

/**
 * NoSearchResults - Specific empty state for search
 */
export function NoSearchResults({ query }) {
    return (
        <EmptyState
            icon="magnify"
            title="Không tìm thấy kết quả"
            description={query ? `Không có kết quả cho "${query}"` : "Nhập từ khóa để tìm kiếm phim, rạp..."}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#1A1A1A",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#2A2A2A",
        borderStyle: "dashed",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    description: {
        color: "#888888",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 24,
    },
    actionButton: {
        backgroundColor: "#6C47DB",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    actionText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
