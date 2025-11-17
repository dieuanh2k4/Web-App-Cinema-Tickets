import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { router } from "expo-router";

export function useRequireAuth() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Nếu không có user và đã load xong -> chuyển về trang login
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  return { user, loading };
}

export function useRequireGuest() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Nếu có user và đã load xong -> chuyển về trang home
      router.replace("/(tabs)/home");
    }
  }, [user, loading]);

  return { user, loading };
}
