import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { authService, userService, customerService } from "../../../services";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);

  const userName =
    customerInfo?.name ||
    user?.user?.name ||
    user?.user?.email ||
    profile?.fullName ||
    "Người dùng";

  useEffect(() => {
    loadProfile();
    loadCustomerInfo();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadCustomerInfo = async () => {
    try {
      if (user?.user?.id) {
        const data = await customerService.getCustomerInfo(user.user.id);
        setCustomerInfo(data);
      }
    } catch (error) {
      console.error("Error loading customer info:", error);
    }
  };

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
    <LinearGradient
      colors={["#0F0F0F", "#0F0F0F", "rgba(108, 71, 219, 0.15)"]}
      locations={[0, 0.7, 1]}
      style={styles.gradient}
    >
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
              source={{
                uri:
                  customerInfo?.avatar ||
                  profile?.avatar ||
                  "https://i.pravatar.cc/200",
              }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          {customerInfo?.email && (
            <Text style={styles.userEmail}>{customerInfo.email}</Text>
          )}
          {customerInfo?.phone && (
            <Text style={styles.userPhone}>{customerInfo.phone}</Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="account-circle-outline"
            label="Thông tin cá nhân"
            onPress={() => router.push("/account/edit-profile")}
            iconColor="#6C47DB"
          />
          <MenuItem
            icon="ticket-outline"
            label="Lịch sử đặt vé"
            onPress={() => router.push("/(tabs)/tickets")}
            iconColor="#FFA500"
          />
          <MenuItem
            icon="lock-outline"
            label="Đổi mật khẩu"
            onPress={() =>
              Alert.alert("Thông báo", "Chức năng đang phát triển")
            }
            iconColor="#2196F3"
          />
          <MenuItem
            icon="cog-outline"
            label="Cài đặt"
            onPress={() =>
              Alert.alert("Thông báo", "Chức năng đang phát triển")
            }
            iconColor="#9E9E9E"
          />
          <MenuItem
            icon="logout"
            label="Đăng xuất"
            onPress={handleLogout}
            iconColor="#F44336"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
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
