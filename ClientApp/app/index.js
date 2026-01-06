import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      // Đã đăng nhập nhưng đang ở màn auth -> chuyển về home
      router.replace("/(tabs)/home");
    } else if (!isAuthenticated && !inAuthGroup) {
      // Chưa đăng nhập nhưng không ở màn auth -> chuyển về login
      router.replace("/(auth)/login");
    } else if (isAuthenticated) {
      // Đã đăng nhập -> chuyển về home
      router.replace("/(tabs)/home");
    } else {
      // Chưa đăng nhập -> chuyển về login
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, loading, segments]);

  // Hiển thị loading
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
});
