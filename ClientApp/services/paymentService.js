import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

export const paymentService = {
  createVNPayPayment: async (paymentData) => {
    try {
      const res = await apiClient.post(
        API_CONFIG.ENDPOINTS.PAYMENT.VNPAY_CREATE,
        paymentData
      );
      return res.data;
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      throw error;
    }
  },

  handleVNPayCallback: async (queryParams) => {
    try {
      const res = await apiClient.get(
        API_CONFIG.ENDPOINTS.PAYMENT.VNPAY_CALLBACK,
        {
          params: queryParams,
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error handling VNPay callback:", error);
      throw error;
    }
  },
};
