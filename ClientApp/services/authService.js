import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_CONFIG } from "../config/api.config";

const AUTH_TOKEN_KEY = "auth_token";
const USER_INFO_KEY = "user_info";

// Mock users database for development (customer only)
const mockUsers = [
  {
    id: 1,
    username: "customer1",
    email: "customer@test.com",
    password: "123456",
    phone: "0123456789",
  },
  {
    id: 2,
    username: "customer2",
    email: "user@demo.com",
    password: "123456",
    phone: "0987654321",
  },
];

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_INFO_KEY);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Lưu thông tin đăng nhập
  async saveAuthData(token, userInfo) {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
      return true;
    } catch (error) {
      console.error("Error saving auth data:", error);
      return false;
    }
  },

  // Lấy token
  async getToken() {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  // Lấy thông tin user
  async getUserInfo() {
    try {
      const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },

  // Kiểm tra đăng nhập
  async isLoggedIn() {
    try {
      const token = await this.getToken();
      return token !== null;
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  },

  // Đăng nhập (chỉ dùng mock data)
  async login(email, password) {
    try {
      console.log("Mock login with:", { email });

      // Tìm user trong mock database
      const mockUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (mockUser) {
        const mockToken = "mock_token_" + Date.now();
        const userInfo = {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          phone: mockUser.phone,
        };

        await this.saveAuthData(mockToken, userInfo);
        return {
          success: true,
          data: { token: mockToken, user: userInfo },
          mock: true,
          message: "Đăng nhập thành công!",
        };
      }

      return {
        success: false,
        error: "Email hoặc mật khẩu không đúng",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi đăng nhập",
      };
    }
  },

  // Đăng ký customer mới
  async register(username, password, email, phone) {
    try {
      console.log("Registering new customer:", { username, email });

      // Kiểm tra email đã tồn tại
      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        return {
          success: false,
          error: "Email đã được sử dụng",
        };
      }

      // Tạo customer mới
      const newUser = {
        id: mockUsers.length + 1,
        username: username,
        email: email,
        password: password,
        phone: phone,
      };

      // Thêm vào mock database
      mockUsers.push(newUser);

      // Tự động đăng nhập sau khi đăng ký
      const mockToken = "mock_token_" + Date.now();
      const userInfo = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
      };

      await this.saveAuthData(mockToken, userInfo);

      return {
        success: true,
        data: {
          token: mockToken,
          user: userInfo,
        },
        mock: true,
        message: "Đăng ký thành công!",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi đăng ký",
      };
    }
  },

  // Xác thực email
  async verifyEmail(email, code) {
    try {
      console.log("Verifying email:", { email, code });

      // Kiểm tra user tồn tại
      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        return {
          success: false,
          error: "Email không tồn tại",
        };
      }

      // Mã demo: "123456"
      if (code === "123456") {
        return {
          success: true,
          message: "Xác thực email thành công!",
          mock: true,
        };
      }

      return {
        success: false,
        error: "Mã xác thực không đúng",
      };
    } catch (error) {
      console.error("Verify email error:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi xác thực email",
      };
    }
  },

  // Quên mật khẩu - gửi mã reset
  async forgotPassword(email) {
    try {
      console.log("Forgot password for:", { email });

      // Kiểm tra email tồn tại
      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        return {
          success: false,
          error: "Email không tồn tại trong hệ thống",
        };
      }

      // Giả lập gửi email reset
      return {
        success: true,
        message: "Đã gửi mã xác thực đến email của bạn!",
        mock: true,
        data: {
          resetCode: "123456", // Mã demo
        },
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu",
      };
    }
  },

  // Đặt lại mật khẩu
  async resetPassword(email, code, newPassword) {
    try {
      console.log("Resetting password for:", { email });

      // Tìm user
      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        return {
          success: false,
          error: "Email không tồn tại",
        };
      }

      // Kiểm tra mã xác thực (demo: "123456")
      if (code !== "123456") {
        return {
          success: false,
          error: "Mã xác thực không đúng",
        };
      }

      // Cập nhật mật khẩu mới
      user.password = newPassword;

      return {
        success: true,
        message: "Đặt lại mật khẩu thành công!",
        mock: true,
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        error: "Có lỗi xảy ra khi đặt lại mật khẩu",
      };
    }
  },

  // Đăng xuất
  async logout() {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_INFO_KEY);
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  },
};
