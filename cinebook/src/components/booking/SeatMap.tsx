import { useState, useEffect } from 'react';
import { Seat } from '../../types/booking.types';
import { mockSeats } from '../../data/mockSeats';
import './SeatMap.css';

interface SeatMapProps {
  onSeatsChange: (seats: Seat[]) => void;
}

const SeatMap = ({ onSeatsChange }: SeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>(mockSeats);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;

    const updatedSeats = seats.map(s => {
      if (s.id === seat.id) {
        return {
          ...s,
          status: s.status === 'selected' ? 'available' : 'selected'
        } as Seat;
      }
      return s;
    });

    setSeats(updatedSeats);

    const newSelectedSeats = updatedSeats.filter(s => s.status === 'selected');
    setSelectedSeats(newSelectedSeats);
    onSeatsChange(newSelectedSeats);
  };

  const getSeatsByRow = (row: string) => {
    return seats.filter(seat => seat.row === row);
  };

  return (
    <div className="seat-map-container">
      <div className="screen-wrapper">
        <div className="screen">MÀN HÌNH</div>
      </div>

      <div className="seats-grid">
        {rows.map(row => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            
            <div className="row-seats">
              {getSeatsByRow(row).map(seat => (
                <button
                  key={seat.id}
                  className={`seat ${seat.type} ${seat.status}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.status === 'booked'}
                  title={`${seat.id} - ${seat.type === 'vip' ? 'VIP' : 'Thường'} - ${seat.price.toLocaleString('vi-VN')}đ`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-sample standard available"></div>
          <span>Ghế thường</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample vip available"></div>
          <span>Ghế VIP</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample standard selected"></div>
          <span>Đang chọn</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample standard booked"></div>
          <span>Đã đặt</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;