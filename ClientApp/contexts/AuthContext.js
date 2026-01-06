import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra token đã lưu khi app khởi động
    checkStoredToken();
  }, []);

  const checkStoredToken = async () => {
    try {
      const token = await authService.getToken();
      const userInfo = await authService.getUserInfo();

      if (token && userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
        // Tự động chuyển đến màn home nếu đang ở màn auth
        // router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("Error checking stored token:", error);
      // Nếu có lỗi, xóa dữ liệu cũ
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const result = await authService.login(username, password);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        // Chuyển hướng về màn home sau khi đăng nhập
        router.replace("/(tabs)/home");
        return result;
      } else {
        setError(result.error.message);
        return result;
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message || "Đăng nhập thất bại");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      // Chuyển hướng về màn đăng nhập
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    // Có thể hiển thị màn hình loading ở đây
    return null;
  }

  const register = async (registerData, imageFile = null) => {
    try {
      setError(null);
      const result = await authService.register(registerData, imageFile);

      if (result.success) {
        // Không tự động đăng nhập sau khi đăng ký
        // Để user tự đăng nhập bằng tài khoản vừa tạo
        return result;
      } else {
        setError(result.error.message);
        return result;
      }
    } catch (error) {
      setError(error.message || "Đăng ký thất bại");
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
        isAuthenticated,
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
