import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

const userService = {
  /**
   * Get all users (combined from 3 endpoints)
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    // Gọi song song 3 endpoints để lấy all Admin, Staff, Customer
    const [admins, staff, customers] = await Promise.all([
      api.get(API_ENDPOINTS.USERS.GET_ALL_ADMIN),
      api.get(API_ENDPOINTS.USERS.GET_ALL_STAFF),
      api.get(API_ENDPOINTS.USERS.GET_ALL_CUSTOMER)
    ]);
    
    // Merge và thêm userType cho mỗi user
    const allUsers = [
      ...admins.data.map(u => ({ ...u, userType: 'Admin' })),
      ...staff.data.map(u => ({ ...u, userType: 'Staff' })),
      ...customers.data.map(u => ({ ...u, userType: 'Customer' }))
    ];
    
    return allUsers;
  },

  /**
   * Create new user by role
   * @param {Object} userData - Must include userType field
   * @param {File} imageFile - Optional avatar image
   * @returns {Promise<Object>}
   */
  async createUser(userData, imageFile = null) {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined && key !== 'userType') {
        formData.append(key, userData[key]);
      }
    });
    
    // Append image if exists
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    
    // Chọn endpoint dựa vào userType
    let endpoint;
    switch (userData.userType?.toLowerCase()) {
      case 'admin':
        endpoint = API_ENDPOINTS.USERS.CREATE_ADMIN;
        break;
      case 'staff':
        endpoint = API_ENDPOINTS.USERS.CREATE_STAFF;
        break;
      case 'customer':
        endpoint = API_ENDPOINTS.USERS.CREATE_CUSTOMER;
        break;
      default:
        throw new Error('Invalid userType. Must be Admin, Staff, or Customer');
    }
    
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @param {string} userType - Admin, Staff, or Customer
   * @returns {Promise<Object>}
   */
  async getUserById(id, userType) {
    // Chọn endpoint dựa vào userType
    let endpoint;
    switch (userType?.toLowerCase()) {
      case 'admin':
        endpoint = API_ENDPOINTS.USERS.GET_ADMIN_BY_ID(id);
        break;
      case 'staff':
        endpoint = API_ENDPOINTS.USERS.GET_STAFF_BY_ID(id);
        break;
      case 'customer':
        endpoint = API_ENDPOINTS.USERS.GET_CUSTOMER_BY_ID(id);
        break;
      default:
        throw new Error('Invalid userType. Must be Admin, Staff, or Customer');
    }
    
    console.log('🔍 getUserById calling endpoint:', endpoint);
    const response = await api.get(endpoint);
    console.log('✅ getUserById response:', response.data);
    return { ...response.data, userType: userType };
  },

  /**
   * Update user by role
   * @param {number} id 
   * @param {Object} userData - Must include userType field
   * @param {File} imageFile - Optional avatar image
   * @returns {Promise<Object>}
   */
  async updateUser(id, userData, imageFile = null) {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined && key !== 'userType') {
        formData.append(key, userData[key]);
      }
    });
    
    // Append image if exists
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    
    // Chọn endpoint dựa vào userType
    let endpoint;
    switch (userData.userType?.toLowerCase()) {
      case 'admin':
        endpoint = API_ENDPOINTS.USERS.UPDATE_ADMIN(id);
        break;
      case 'staff':
        endpoint = API_ENDPOINTS.USERS.UPDATE_STAFF(id);
        break;
      case 'customer':
        endpoint = API_ENDPOINTS.USERS.UPDATE_CUSTOMER(id);
        break;
      default:
        throw new Error('Invalid userType. Must be Admin, Staff, or Customer');
    }
    
    const response = await api.put(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  /**
   * Delete user by role
   * @param {number} id 
   * @param {string} userType - Admin, Staff, or Customer
   * @returns {Promise<Object>}
   */
  async deleteUser(id, userType) {
    // Chọn endpoint dựa vào userType
    let endpoint;
    switch (userType?.toLowerCase()) {
      case 'admin':
        endpoint = API_ENDPOINTS.USERS.DELETE_ADMIN(id);
        break;
      case 'staff':
        endpoint = API_ENDPOINTS.USERS.DELETE_STAFF(id);
        break;
      case 'customer':
        endpoint = API_ENDPOINTS.USERS.DELETE_CUSTOMER(id);
        break;
      default:
        throw new Error('Invalid userType. Must be Admin, Staff, or Customer');
    }
    
    const response = await api.delete(endpoint);
    return response.data;
  },
};

export default userService;
