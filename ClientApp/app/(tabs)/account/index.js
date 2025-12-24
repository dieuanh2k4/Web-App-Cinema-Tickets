import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  LinearGradient,
} from "react-native";
import { useRouter } from "expo-router";
import { authService } from "../../../services/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const userName = user?.user?.name || user?.user?.email || "Phong Pham";

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất");
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, iconColor = "#808080" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#808080" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/200" }}
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon="square-edit-outline"
          label="Cập nhật thông tin"
          onPress={() => Alert.alert("Thông báo", "Chức năng đang phát triển")}
        />
        <MenuItem
          icon="lock-outline"
          label="Thay đổi mật khẩu"
          onPress={() => Alert.alert("Thông báo", "Chức năng đang phát triển")}
        />
        <MenuItem
          icon="ticket-outline"
          label="Vé của tôi"
          onPress={() => router.push("/(tabs)/tickets")}
        />
        <MenuItem icon="logout" label="Đăng xuất" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1532",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#4A90E2",
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#FFA500",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1A1532",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(42, 42, 60, 0.6)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "400",
  },
});
