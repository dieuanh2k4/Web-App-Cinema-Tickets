import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra token đã lưu khi app khởi động
    checkStoredToken();
  }, []);

  const checkStoredToken = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking stored token:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      // Lưu thông tin user vào AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // Chuyển hướng về màn home sau khi đăng nhập
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Error storing user data:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Xóa thông tin user khỏi AsyncStorage
      await AsyncStorage.removeItem("user");
      setUser(null);
      // Chuyển hướng về màn đăng nhập
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  if (loading) {
    // Có thể hiển thị màn hình loading ở đây
    return null;
  }

  const register = async (userData) => {
    try {
      setError(null);
      // Lưu thông tin user vào AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // Chuyển hướng về màn home sau khi đăng ký
      router.replace("/(tabs)/home");
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const verifyEmail = async (verificationData) => {
    try {
      setError(null);
      // Thực hiện xác thực email
      // Sau khi xác thực thành công, cập nhật trạng thái user
      const updatedUser = { ...user, emailVerified: true, ...verificationData };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        verifyEmail,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
