import { Seat } from '../types/booking.types';

// Tạo sơ đồ ghế: 7 hàng x 10 ghế
export const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const seatsPerRow = 10;

  // Hàng D-G là VIP (4 hàng cuối)
  const vipRows = ['D', 'E', 'F', 'G'];

  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const isVip = vipRows.includes(row);
      
      // Random một số ghế đã được đặt
      const isBooked = Math.random() < 0.2; // 20% ghế đã được đặt

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type: isVip ? 'vip' : 'standard',
        status: isBooked ? 'booked' : 'available',
        price: isVip ? 150000 : 80000
      });
    }
  });

  return seats;
};

export const mockSeats = generateSeats();