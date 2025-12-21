import { createContext, useState } from 'react';
import { adminAccounts } from '../data/mockData';
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

  const login = (username, password) => {
    const account = adminAccounts.find(
      acc => acc.username === username && acc.password === password
    );

    if (account) {
      const { password: _, ...userWithoutPassword } = account;
      setUser(userWithoutPassword);
      setToStorage(STORAGE_KEYS.USER, userWithoutPassword);
      setToStorage(STORAGE_KEYS.TOKEN, `token_${account.id}_${Date.now()}`);
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: 'Tài khoản hoặc mật khẩu không đúng' };
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
    loading: false,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
