import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo axios instance với base URL
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  timeout: 10000,
});

// Request interceptor để thêm token vào header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý errors
// KHÔNG tự động xóa token - để các màn hình tự xử lý
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Chỉ log lỗi, không xóa token tự động
    // Việc xóa token sẽ được xử lý bởi AuthContext khi cần
    if (error.response?.status === 401) {
      console.log("API returned 401 - Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
