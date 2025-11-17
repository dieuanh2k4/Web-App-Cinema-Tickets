import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_CONFIG } from "../config/api.config";

const AUTH_TOKEN_KEY = "auth_token";
const USER_INFO_KEY = "user_info";

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
      // Nếu token hết hạn, xóa token và chuyển về màn đăng nhập
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_INFO_KEY);
      // Có thể thêm logic để refresh token ở đây
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

  // Đăng nhập (thử API trước, nếu thất bại do mạng thì fallback sang mock local)
  async login(email, password) {
    try {
      // Shortcut for local development: a mock account that always works
      if (email === "dev@local" && password === "password123") {
        const mockToken = "mock_token_dev";
        const mockUserInfo = {
          id: 999,
          name: "Dev User",
          email: "dev@local",
          phone: "0000000000",
        };
        await this.saveAuthData(mockToken, mockUserInfo);
        return {
          success: true,
          data: { token: mockToken, user: mockUserInfo },
          mock: true,
        };
      }
      console.log("Logging in with:", { email });
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data?.token) {
        // Lưu token và thông tin user
        await this.saveAuthData(response.data.token, response.data.user);
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.data?.message || "Đăng nhập không thành công",
      };
    } catch (error) {
      console.error("Login error:", error.response || error);
      // Nếu là lỗi mạng (không có response) thì dùng mock account để phát triển nhanh
      const isNetworkError = !error.response;
      if (isNetworkError) {
        const mockToken = "mock_token_" + Date.now();
        const mockUserInfo = {
          id: 1,
          name: "Nguyễn Văn A",
          email: email || "test@local",
          phone: "0123456789",
        };
        await this.saveAuthData(mockToken, mockUserInfo);
        return {
          success: true,
          data: { token: mockToken, user: mockUserInfo },
          mock: true,
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập",
      };
    }
  },

  // Đăng ký
  async register(email, password) {
    try {
      console.log("Registering with:", { email });
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
      });

      console.log("Register response:", response.data);

      if (response.data?.token) {
        // Lưu token và thông tin user
        await this.saveAuthData(response.data.token, response.data.user);
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.data?.message || "Đăng ký không thành công",
      };
    } catch (error) {
      console.error("Register error:", error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || "Có lỗi xảy ra khi đăng ký",
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
