import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const userService = {
  /**
   * Lấy profile user hiện tại
   * Sử dụng /Auth/me (hoạt động với mọi role đã đăng nhập)
   */
  getProfile: async () => {
    try {
      // Sử dụng /Auth/me thay vì /User/profile
      // Vì /User/profile dùng claim "id" không chuẩn
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      return {
        id: res.data?.userId ?? null,
        username: res.data?.username ?? "",
        role: res.data?.role ?? "",
        email: "",
        phoneNumber: "",
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách vé của user hiện tại
   */
  getMyTickets: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.MY_TICKETS);
      return res.data;
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      // Return empty array instead of throwing
      return [];
    }
  },
};
