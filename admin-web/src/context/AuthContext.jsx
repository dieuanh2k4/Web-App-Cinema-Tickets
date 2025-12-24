import { createContext, useState } from 'react';
import { getFromStorage, setToStorage, removeFromStorage, STORAGE_KEYS } from '../utils/helpers';
import authService from '../services/authService';

// Create context with default value
const AuthContext = createContext(null);

// Export for useAuth hook
export { AuthContext };

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize state from localStorage
    return getFromStorage(STORAGE_KEYS.USER);
  });
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // Call API login
      const response = await authService.login(username, password);
      
      // BE returns: { isSuccess, message, data: { username, role, token } }
      const { data } = response;
      
      if (!data) {
        throw new Error('Invalid response from server');
      }
      
      const { username: userName, role, token } = data;
      
      // Create user object
      const userData = {
        username: userName,
        role: role.toLowerCase(), // Convert to lowercase (Admin -> admin, Staff -> staff)
        fullName: userName, // Use username as fullName (placeholder)
        email: '', // Not available from BE
        phone: '', // Not available from BE
        avatar: `https://ui-avatars.com/api/?name=${userName}&background=6366f1&color=fff`,
      };
      
      setUser(userData);
      setToStorage(STORAGE_KEYS.USER, userData);
      setToStorage(STORAGE_KEYS.TOKEN, token);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.TOKEN);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
