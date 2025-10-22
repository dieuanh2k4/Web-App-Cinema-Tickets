import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "auth_token";
const USER_INFO_KEY = "user_info";

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

  // Đăng nhập
  async login(email, password) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return { success: false, error: "Email không hợp lệ" };
      }

      if (!password || password.length < 6) {
        return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };
      }

      const mockToken = "mock_token_" + Date.now();
      const mockUserInfo = {
        id: 1,
        name: "Nguyễn Văn A",
        email: "123@gmail.com",
        phone: "0123456789",
      };

      await this.saveAuthData(mockToken, mockUserInfo);

      return { success: true, user: mockUserInfo };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: "Có lỗi xảy ra khi đăng nhập" };
    }
  },
};
