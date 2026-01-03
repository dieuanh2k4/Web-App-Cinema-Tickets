import apiClient from "./apiService";
import { API_CONFIG } from "../config/api.config";

/**
 * Chat AI Service
 * Chatbot tư vấn phim và đặt vé
 */
export const chatService = {
  /**
   * Gửi tin nhắn cho AI chatbot
   * @param {string} message - Tin nhắn từ user
   * @param {string} conversationId - ID cuộc hội thoại (optional)
   */
  sendMessage: async (message, userId = null) => {
    try {
      const res = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT.SEND_MESSAGE, {
        Message: message,
        UserId: userId,
      });
      return res.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },
};
