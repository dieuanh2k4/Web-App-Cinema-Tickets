import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { authService } from "../../../services/authService";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function AccountScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    username: "Guest",
    email: "guest@example.com",
    phone: "0000000000",
  });

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const user = await authService.getUserInfo();
      if (user && user.user) {
        // AuthContext lưu { token, user: {...} }
        setUserInfo(user.user);
      } else if (user) {
        // Nếu chỉ có user object
        setUserInfo(user);
      }
    } catch (error) {
      console.error("Error loading user info:", error);
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
            await authService.logout();
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất");
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, color = "#FFFFFF", onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconCircle, { backgroundColor: color + "15" }]}>
          <MaterialCommunityIcons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with gradient effect */}
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userInfo.username || userInfo.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={14} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.username || "Guest"}</Text>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons
                name="email-outline"
                size={14}
                color="#888888"
              />
              <Text style={styles.contactText}>{userInfo.email || ""}</Text>
            </View>
            {userInfo.phone && (
              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={14}
                  color="#888888"
                />
                <Text style={styles.contactText}>{userInfo.phone}</Text>
              </View>
            )}
          </View>

          {/* Membership Badge */}
          <View style={styles.membershipBadge}>
            <MaterialCommunityIcons
              name="star-circle"
              size={20}
              color="#FFD700"
            />
            <Text style={styles.membershipText}>Thành viên Bạc</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Vé đã đặt</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Điểm tích lũy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Ưu đãi</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>TIỆN ÍCH</Text>

          <View style={styles.menuList}>
            <MenuItem
              icon="account-circle-outline"
              label="Thông tin cá nhân"
              color="#6C47DB"
            />
            <MenuItem
              icon="ticket-confirmation-outline"
              label="Vé của tôi"
              color="#FF6B9D"
            />
            <MenuItem
              icon="wallet-outline"
              label="Ví và thanh toán"
              color="#4ECDC4"
            />
            <MenuItem
              icon="gift-outline"
              label="Ưu đãi của tôi"
              color="#FFB74D"
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>CHUNG</Text>

          <View style={styles.menuList}>
            <MenuItem icon="bell-outline" label="Thông báo" color="#9C27B0" />
            <MenuItem
              icon="shield-check-outline"
              label="Bảo mật"
              color="#F44336"
            />
            <MenuItem
              icon="help-circle-outline"
              label="Trợ giúp & Hỗ trợ"
              color="#2196F3"
            />
            <MenuItem
              icon="information-outline"
              label="Giới thiệu"
              color="#607D8B"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons
            name="logout-variant"
            size={20}
            color="#FF6B6B"
          />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  headerGradient: {
    backgroundColor: "#6C47DB",
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#1A1A1A",
    margin: 16,
    marginTop: -10,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#6C47DB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1A1A1A",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#6C47DB",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 2,
  },
  contactText: {
    fontSize: 14,
    color: "#666666",
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2510",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    gap: 6,
  },
  membershipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D4A017",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6C47DB",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888888",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#333333",
    marginHorizontal: 8,
  },
  menuSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    marginLeft: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuList: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#3A2020",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#AAAAAA",
  },
});
