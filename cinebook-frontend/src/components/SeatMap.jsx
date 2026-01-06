import { FiMonitor } from 'react-icons/fi'

export default function SeatMap({ seats, selectedSeats, onSeatSelect, bookedSeats = [] }) {
  // Organize seats into rows (giả sử tên ghế format: A1, A2, B1, B2...)
  const organizeSeats = () => {
    const rows = {}
    seats.forEach(seat => {
      const row = seat.seatNumber.charAt(0) // A, B, C...
      if (!rows[row]) rows[row] = []
      rows[row].push(seat)
    })
    
    // Sort by row letter and seat number
    Object.keys(rows).forEach(row => {
      rows[row].sort((a, b) => {
        const numA = parseInt(a.seatNumber.slice(1))
        const numB = parseInt(b.seatNumber.slice(1))
        return numA - numB
      })
    })
    
    return Object.entries(rows).sort()
  }

  const getSeatClass = (seat) => {
    const isBooked = bookedSeats.includes(seat.seatId) || !seat.isAvailable
    const isSelected = selectedSeats.includes(seat.seatId)
    const isVip = seat.seatType?.toLowerCase().includes('vip')
    const baseClass = 'w-12 h-12 rounded-md text-xs font-bold transition-all duration-200'
    
    // Ghế đã đặt - màu hồng/đỏ, không thể chọn
    if (isBooked) {
      return `${baseClass} bg-pink-600 text-white cursor-not-allowed opacity-80`
    }
    
    // Ghế đang chọn - màu tím đậm
    if (isSelected) {
      return `${baseClass} bg-purple text-white cursor-pointer shadow-lg shadow-purple/50 scale-105`
    }
    
    // Ghế VIP trống - màu cam
    if (isVip) {
      return `${baseClass} bg-orange-500 text-white cursor-pointer hover:bg-orange-600 hover:scale-105 hover:shadow-lg`
    }
    
    // Ghế thường trống - màu xám
    return `${baseClass} bg-gray-600 text-white cursor-pointer hover:bg-gray-500 hover:scale-105 hover:shadow-lg`
  }

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat.seatId) || !seat.isAvailable) return
    onSeatSelect(seat.seatId)
  }

  const seatRows = organizeSeats()

  return (
    <div className="space-y-8">
      {/* Seat Map */}
      <div className="flex justify-center bg-dark/50 rounded-xl p-8">
        <div className="space-y-2.5">
          {seatRows.map(([rowLetter, rowSeats]) => (
            <div key={rowLetter} className="flex items-center space-x-3">
              {/* Row label */}
              <div className="w-10 text-center text-white font-bold text-lg">
                {rowLetter}
              </div>
              
              {/* Seats in row */}
              <div className="flex space-x-2">
                {rowSeats.map((seat) => {
                  const isBooked = bookedSeats.includes(seat.seatId) || !seat.isAvailable
                  const isSelected = selectedSeats.includes(seat.seatId)
                  
                  return (
                    <button
                      key={seat.seatId}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isBooked}
                      className={getSeatClass(seat)}
                      title={`${seat.seatNumber} - ${seat.seatType}${isBooked ? ' (Đã đặt)' : ''}`}
                    >
                      {seat.seatNumber.slice(1)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-gray-custom/30">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-md bg-gray-600"></div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-300 font-medium">Ghế thường (Hàng D-J)</span>
            <span className="text-xs text-green-400 font-semibold">100.000đ</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-md bg-orange-500"></div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-300 font-medium">Ghế VIP (Hàng A-C)</span>
            <span className="text-xs text-orange-400 font-semibold">150.000đ</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-md bg-pink-600"></div>
          <span className="text-sm text-gray-300 font-medium">Ghế đã đặt</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-md bg-purple"></div>
          <span className="text-sm text-gray-300 font-medium">Đang chọn</span>
        </div>
      </div>
    </div>
  )
}
