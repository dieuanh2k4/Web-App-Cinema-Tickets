// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'cinebook_user',
  TOKEN: 'cinebook_token',
  MOVIES: 'cinebook_movies',
  ROOMS: 'cinebook_rooms',
  SHOWTIMES: 'cinebook_showtimes',
  ORDERS: 'cinebook_orders',
  CUSTOMERS: 'cinebook_customers',
  TICKET_PRICES: 'cinebook_ticket_prices'
};

// Get item from localStorage
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting from storage:', error);
    return null;
  }
};

// Set item to localStorage
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting to storage:', error);
    return false;
  }
};

// Remove item from localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from storage:', error);
    return false;
  }
};

// Clear all localStorage
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// Format currency (VND)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'dd/MM/yyyy') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  if (format === 'dd/MM/yyyy') {
    return `${day}/${month}/${year}`;
  }
  return date;
};

// Format time
export const formatTime = (time) => {
  return time;
};

// Get day type (weekday/weekend)
export const getDayType = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  return (day === 0 || day === 6) ? 'weekend' : 'weekday';
};

// Get time slot (morning/afternoon/evening)
export const getTimeSlot = (time) => {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
};

// Calculate ticket price
export const calculateTicketPrice = (seatType, date, time, ticketPrices) => {
  const dayType = getDayType(date);
  const timeSlot = getTimeSlot(time);
  
  const priceConfig = ticketPrices.find(
    p => p.seatType === seatType && p.timeSlot === timeSlot && p.dayType === dayType
  );
  
  return priceConfig ? priceConfig.price : 0;
};

// Generate unique ID
export const generateId = (prefix = 'ID') => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number (Vietnamese)
export const isValidPhone = (phone) => {
  const re = /^(0|\+84)[0-9]{9}$/;
  return re.test(phone);
};
