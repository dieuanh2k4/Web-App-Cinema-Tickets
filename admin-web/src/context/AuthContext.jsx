import { createContext, useState } from 'react';
import authService from '../services/authService';
import { getFromStorage, setToStorage, removeFromStorage, STORAGE_KEYS } from '../utils/helpers';

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

  const login = async (username, password) => {
    try {
      // Call API login
      const response = await authService.login(username, password);
      
      // API trả về: { isSuccess: true, data: { username, role, token }, message }
      if (!response.isSuccess) {
        return { 
          success: false, 
          message: response.message || 'Đăng nhập không thành công' 
        };
      }

      const { token, ...userData } = response.data;
      
      // Save user data and token
      setUser(userData);
      setToStorage(STORAGE_KEYS.USER, userData);
      // Save token as plain string, not JSON
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    removeFromStorage(STORAGE_KEYS.USER);
    // Remove token directly
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const value = {
    user,
    login,
    logout,
    loading: false,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
