import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const customerService = {
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

  getProfile: async () => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.CUSTOMER.GET_PROFILE
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  updateCustomerInfo: async (id, customerData, imageFile = null) => {
    try {
      const formData = new FormData();

      if (customerData.name) formData.append("Name", customerData.name);
      if (customerData.birth) formData.append("Birth", customerData.birth);
      if (customerData.gender) formData.append("Gender", customerData.gender);
      if (customerData.address)
        formData.append("Address", customerData.address);
      if (customerData.phone) formData.append("Phone", customerData.phone);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const res = await apiClient.put(
        API_CONFIG.ENDPOINTS.CUSTOMER.UPDATE_INFO(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating customer info:", error);
      throw error;
    }
  },

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
        API_CONFIG.ENDPOINTS.CUSTOMER.UPDATE_PROFILE,
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
};
