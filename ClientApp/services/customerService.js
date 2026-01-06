import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const customerService = {
  /**
   * Lấy thông tin customer của user hiện tại
   * Sử dụng /Customer/me - tự động lấy từ JWT token
   */
  getProfile: async () => {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.CUSTOMER.ME);
      const data = res.data;
      return {
        id: data?.id,
        name: data?.name ?? "",
        email: data?.email ?? "",
        phone: data?.phone ?? "",
        address: data?.address ?? "",
        birth: data?.birth ?? "",
        gender: data?.gender ?? "",
        avatar: data?.avatar ?? "",
      };
    } catch (error) {
      // Nếu 401/404, trả về null
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        console.log("Customer info not available:", error?.response?.status);
        return null;
      }
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin customer của user hiện tại
   * Sử dụng PUT /Customer/me - tự động từ JWT token
   */
  updateProfile: async (profileData, imageFile = null) => {
    try {
      const formData = new FormData();

      if (profileData.name) formData.append("Name", profileData.name);
      if (profileData.birth) formData.append("Birth", profileData.birth);
      if (profileData.gender) formData.append("Gender", profileData.gender);
      if (profileData.address) formData.append("Address", profileData.address);
      if (profileData.phone) formData.append("Phone", profileData.phone);
      if (profileData.email) formData.append("Email", profileData.email);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const res = await apiClient.put(
        API_CONFIG.ENDPOINTS.CUSTOMER.ME,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin customer theo ID (admin use)
   */
  getCustomerInfo: async (id) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.CUSTOMER.GET_INFO(id)
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching customer info:", error);
      throw error;
    }
  },
};
