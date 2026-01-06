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

  // Đăng nhập
  async login(username, password) {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        Username: username,
        Password: password,
      });

      // Backend response: { isSuccess, message, data: { username, role, token } }
      if (response.data?.isSuccess && response.data?.data?.token) {
        const { token, username: userName, role } = response.data.data;
        const userInfo = { username: userName, role };
        await this.saveAuthData(token, userInfo);

        return {
          success: true,
          data: {
            token,
            user: userInfo,
          },
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: {
          message: response.data?.message || "Đăng nhập thất bại",
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: {
          message:
            error?.response?.data?.message ||
            error?.response?.data ||
            error.message ||
            "Không thể kết nối đến server",
        },
      };
    }
  },

  // Đăng ký khách hàng
  async register(registerData, imageFile = null) {
    try {
      // Backend yêu cầu FormData (multipart/form-data)
      const formData = new FormData();

      // Append tất cả các field
      formData.append("Name", registerData.Name || "");
      formData.append("username", registerData.username || "");
      formData.append("Email", registerData.Email || "");
      formData.append("password", registerData.password || "");
      formData.append("phoneNumber", registerData.phoneNumber || "");
      formData.append("Birth", registerData.Birth || "2000-01-01");
      formData.append("Gender", registerData.Gender || "Khác");
      formData.append("Address", registerData.Address || "Chưa cập nhật");
      formData.append(
        "createdDate",
        registerData.createdDate || new Date().toISOString()
      );

      // Append file nếu có
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const response = await api.post(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Xử lý response từ backend
      if (response.status === 200 || response.status === 201) {
        // Response thành công
        if (response.data) {
          return {
            success: true,
            data: {
              user: response.data.user || response.data.data || response.data,
            },
            message: response.data.message || "Đăng ký thành công",
          };
        }
      }

      return {
        success: false,
        error: {
          message: response.data?.message || "Đăng ký thất bại",
        },
      };
    } catch (error) {
      console.error("Register error:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Không thể kết nối đến server";

      if (error.response) {
        // Server responded with error
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.errors) {
          // Validation errors
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(", ");
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.status === 400) {
          errorMessage = "Thông tin đăng ký không hợp lệ";
        } else if (error.response.status === 409) {
          errorMessage = "Tên đăng nhập hoặc email đã tồn tại";
        } else if (error.response.status === 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else {
        // Something else happened
        errorMessage = error.message || "Đã xảy ra lỗi không xác định";
      }

      return {
        success: false,
        error: {
          message: errorMessage,
        },
      };
    }
  },

  // Lấy thông tin user hiện tại
  async getMe() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      console.error("Get me error:", error);
      throw error;
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
