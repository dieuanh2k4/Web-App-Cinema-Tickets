/**
 * =======================================================
 * SERVICES INDEX
 * Export tất cả services để dễ dàng import vào components
 * =======================================================
 *
 * Usage trong components:
 * import { movieService, authService, bookingService } from '../services';
 */

// Core services
export { default as apiClient } from "./apiService";
export { authService } from "./authService";
export { movieService } from "./movieService";
export { theaterService } from "./theaterService";
export { showtimeService } from "./showtimeService";

// Booking & Tickets
export { seatService } from "./seatService";
export { roomService } from "./roomService";
export { ticketService } from "./ticketService";
export { ticketPriceService } from "./ticketPriceService";

// Payment & Chat
export { paymentService } from "./paymentService";
export { chatService } from "./chatService";

// User & Search
export { userService } from "./userService";
export { searchService } from "./searchService";

// Export từ bookingService (có thể có nhiều exports)
export * from "./bookingService";
