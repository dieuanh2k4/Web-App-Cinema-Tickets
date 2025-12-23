import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_CONFIG } from "../config/api.config";

const AUTH_TOKEN_KEY = "auth_token";
const USER_INFO_KEY = "user_info";

// authService uses backend endpoints via API_CONFIG

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
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
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`;
      console.log("🔵 Login Request:", { url, email });

      const res = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        Username: email, // Backend expects 'Username' not 'email'
        Password: password, // Backend expects 'Password' with capital P
      });

      console.log("✅ Login Response:", res.data);

      if (res?.data?.isSuccess || res?.data?.token || res?.data?.data) {
        // Response shape may vary; try to extract token and user
        const token =
          res.data?.data?.token ||
          res.data?.token ||
          res.data?.data?.accessToken;
        const user = res.data?.data?.user || res.data?.data || null;
        if (token) {
          await this.saveAuthData(token, user);
        }
        return { success: true, data: { token, user }, raw: res.data };
      }

      return { success: false, error: res.data || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      return { success: false, error: error?.response?.data || error.message };
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
